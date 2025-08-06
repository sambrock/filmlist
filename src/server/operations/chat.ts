import { eq } from 'drizzle-orm';
import { BatchItem } from 'drizzle-orm/batch';
import { z } from 'zod';

import { db, Message, messages, Movie, movies, threads, users } from '@/drizzle';
import { parseMoviesFromOutputStream, stream } from '@/lib/ai';
import { findMovie, getMovieById } from '@/lib/tmdb';
import { uuid } from '@/lib/utils';
import { createContext } from '../trpc';

/**
 * The chat operation does not use TRPC as server-sent events (SSE) are not supported by TRPC.
 * Instead, it uses a Next.js API route (see src/app/api/chat/route.ts)
 */

export type ChatSSE =
  | { type: 'pending'; v: Message }
  | { type: 'done'; v: Message }
  | { type: 'content'; v: string }
  | { type: 'movie'; v: Movie }
  | { type: 'end' };

const encodeSSE = (data: ChatSSE | 'end') => {
  if (data === 'end') {
    return new TextEncoder().encode(`event: end\ndata: \n\n`);
  }
  return new TextEncoder().encode(`event: delta\ndata: ${JSON.stringify(data)}\n\n`);
};

const InputSchema = z.object({
  threadId: z.string(),
  userId: z.string(),
  model: z.string(),
  content: z.string(),
});

export const chat = async (request: Request) => {
  const ctx = await createContext();

  if (!ctx.auth || !ctx.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = InputSchema.safeParse(body);
  if (parsed.success === false) {
    return Response.json({ error: parsed.error.message }, { status: 400 });
  }

  const { model, content } = parsed.data;
  let { threadId, userId } = parsed.data;

  /**
   * All database operations are batched and executed after streaming is complete.
   */
  const batch: BatchItem<'pg'>[] = [];

  if (userId.startsWith('draft:')) {
    userId = userId.replace('draft:', '');
    batch.push(db.insert(users).values({ userId, anon: true }).onConflictDoNothing());
  }

  if (threadId.startsWith('draft:')) {
    threadId = threadId.replace('draft:', '');
    batch.push(db.insert(threads).values({ threadId, userId, title: '', model }).onConflictDoNothing());
  }

  const messageUser: Message = {
    messageId: uuid(),
    threadId,
    parentId: null,
    serial: 0,
    model,
    content,
    structured: null,
    role: 'user',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const messageAssistant: Message = {
    messageId: uuid(),
    threadId,
    parentId: messageUser.messageId,
    serial: 0,
    model,
    content: '',
    structured: null,
    role: 'assistant',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  batch.push(db.insert(messages).values([messageUser, messageAssistant]));

  const messageHistory = parsed.data.threadId.startsWith('draft:')
    ? []
    : await db.query.messages.findMany({
        where: (messages, { eq }) => eq(messages.threadId, threadId),
        orderBy: (messages, { asc }) => asc(messages.serial),
        columns: { role: true, content: true },
        limit: 20,
      });

  const outputStream = await stream(model, [...messageHistory, { role: 'user', content }]);

  const responseStream = new ReadableStream({
    async start(controller) {
      const outputReader = outputStream.textStream.getReader();

      controller.enqueue(encodeSSE({ type: 'pending', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'pending', v: messageAssistant }));

      while (true) {
        const { done, value } = await outputReader.read();
        if (done) break;

        messageAssistant.content += value;

        controller.enqueue(encodeSSE({ type: 'content', v: value }));
      }

      messageAssistant.structured = parseMoviesFromOutputStream(messageAssistant.content);

      await Promise.all(
        messageAssistant.structured.map(async (parsedOutput, index) => {
          const found = await findMovie(parsedOutput.title, parsedOutput.releaseYear);
          if (!found) return parsedOutput;

          const source = await getMovieById(found.id);
          if (!source) return parsedOutput;

          const movie: Movie = {
            movieId: uuid(),
            tmdbId: source.id,
            source,
            createdAt: new Date(),
          };

          batch.push(db.insert(movies).values(movie).onConflictDoNothing());

          controller.enqueue(encodeSSE({ type: 'movie', v: movie }));

          messageAssistant.structured![index].tmdbId = movie.tmdbId;
        })
      );

      messageUser.status = 'done';
      messageAssistant.status = 'done';

      batch.push(
        db.update(messages).set(messageUser).where(eq(messages.messageId, messageUser.messageId)),
        db.update(messages).set(messageAssistant).where(eq(messages.messageId, messageAssistant.messageId))
      );

      controller.enqueue(encodeSSE({ type: 'done', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'done', v: messageAssistant }));

      controller.enqueue(encodeSSE({ type: 'end' }));
      controller.enqueue(encodeSSE('end'));

      await db.batch(batch as [BatchItem<'pg'>, ...BatchItem<'pg'>[]]);

      controller.close();
    },
  });

  return new Response(responseStream, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
};
