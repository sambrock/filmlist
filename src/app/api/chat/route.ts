import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { eq } from 'drizzle-orm';
import { BatchItem } from 'drizzle-orm/batch';
import { z } from 'zod';

import { createContext } from '@/server/trpc';
import { setAuthTokenCookie } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { messageMovies, messages, movies, threads, users } from '@/lib/drizzle/schema';
import { Message, Movie } from '@/lib/drizzle/types';
import { tmdbFindMovie, tmdbGetMovieById } from '@/lib/tmdb/client';
import { parseMoviesFromOutputStream, SYSTEM_CONTEXT_MESSAGE } from '@/lib/utils/ai';
import { clearUuid, isDraftUuid, uuid } from '@/lib/utils/uuid';

export const maxDuration = 30;
// export const runtime = 'edge';
// export const dynamic = 'force-dynamic';

export type ChatSSE =
  | { type: 'user'; v: string }
  | { type: 'thread'; v: string }
  | { type: 'content'; v: string }
  | { type: 'message'; v: Message }
  | { type: 'movie'; v: Movie }
  | { type: 'end' };

const encodeSSE = (data: ChatSSE | 'end') => {
  if (data === 'end') {
    return new TextEncoder().encode(`event: end\ndata: \n\n`);
  }
  return new TextEncoder().encode(`event: delta\ndata: ${JSON.stringify(data)}\n\n`);
};

const BodySchema = z.object({
  threadId: z.string(),
  userId: z.string(),
  model: z.string(),
  content: z.string(),
});

export const POST = async (request: Request) => {
  const ctx = await createContext();

  if (!ctx.auth || !ctx.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = BodySchema.safeParse(body);
  if (parsed.success === false) {
    return Response.json({ error: parsed.error.message }, { status: 400 });
  }

  const { model, content } = parsed.data;
  let { threadId, userId } = parsed.data;

  /**
   * All database operations are batched and executed after streaming is complete.
   */
  const batch: BatchItem<'pg'>[] = [];

  if (isDraftUuid(userId)) {
    userId = clearUuid(userId);
    batch.push(db.insert(users).values({ userId, anon: true }).onConflictDoNothing());
    await setAuthTokenCookie({ userId, anon: true });
  }

  if (isDraftUuid(threadId)) {
    threadId = clearUuid(threadId);
    batch.push(db.insert(threads).values({ threadId, userId, title: '', model }).onConflictDoNothing());
  }

  const messageUser: Message = {
    messageId: uuid(),
    threadId,
    parentId: null,
    serial: undefined as unknown as number,
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
    serial: undefined as unknown as number,
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

  const dataStream = streamText({
    model: openai('gpt-4.1-nano'),
    messages: [SYSTEM_CONTEXT_MESSAGE, ...messageHistory, { role: 'user', content }],
  });

  const responseStream = new ReadableStream({
    async start(controller) {
      const outputReader = dataStream.textStream.getReader();

      controller.enqueue(encodeSSE({ type: 'user', v: userId }));
      controller.enqueue(encodeSSE({ type: 'thread', v: threadId }));

      controller.enqueue(encodeSSE({ type: 'message', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'message', v: messageAssistant }));

      while (true) {
        const { done, value } = await outputReader.read();
        if (done) break;

        messageAssistant.content += value;

        controller.enqueue(encodeSSE({ type: 'content', v: value }));
      }

      messageAssistant.structured = parseMoviesFromOutputStream(messageAssistant.content);

      await Promise.all(
        messageAssistant.structured.map(async (parsedOutput, index) => {
          const found = await tmdbFindMovie(parsedOutput.title, parsedOutput.releaseYear);
          if (!found) return parsedOutput;

          const source = await tmdbGetMovieById(found.id);
          if (!source) return parsedOutput;

          const movie: Movie = {
            movieId: source.id,
            tmdbId: source.id,
            source,
            createdAt: new Date(),
          };

          messageAssistant.structured![index].tmdbId = movie.tmdbId;

          batch.push(
            db.insert(movies).values(movie).onConflictDoNothing(),
            db.insert(messageMovies).values({ messageId: messageAssistant.messageId, movieId: movie.movieId })
          );

          controller.enqueue(encodeSSE({ type: 'movie', v: movie }));
        })
      );

      messageUser.status = 'done';
      messageAssistant.status = 'done';

      batch.push(
        db.update(messages).set(messageUser).where(eq(messages.messageId, messageUser.messageId)),
        db.update(messages).set(messageAssistant).where(eq(messages.messageId, messageAssistant.messageId))
      );

      controller.enqueue(encodeSSE({ type: 'message', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'message', v: messageAssistant }));

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
