import { generateText, streamText } from 'ai';
import { eq } from 'drizzle-orm';
import { BatchItem } from 'drizzle-orm/batch';
import { z } from 'zod';

import { createContext } from '@/server/trpc';
import { setAuthTokenCookie } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { chats, messageMovies, messages, movies, users } from '@/lib/drizzle/schema';
import { MessageAssistant, MessageUser, Movie } from '@/lib/drizzle/types';
import { getModel, Model, models } from '@/lib/models';
import { tmdbFindMovie, tmdbGetMovieById } from '@/lib/tmdb/client';
import { uuid } from '@/lib/utils';
import { modelResponseToStructured, SYSTEM_CONTEXT_MESSAGE } from '@/lib/utils/ai';

export const maxDuration = 30;

export type ChatSSE =
  | { type: 'content'; v: string; id: string }
  | { type: 'message'; v: MessageUser | MessageAssistant }
  | { type: 'end' };

const encodeSSE = (data: ChatSSE | 'end') => {
  if (data === 'end') {
    return new TextEncoder().encode(`event: end\ndata: \n\n`);
  }
  return new TextEncoder().encode(`event: delta\ndata: ${JSON.stringify(data)}\n\n`);
};

const BodySchema = z.object({
  chatId: z.string(),
  model: z.string().refine((model) => models.has(model as Model)),
  content: z.string(),
});

export const POST = async (request: Request) => {
  const ctx = await createContext();
  if (!ctx.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = BodySchema.safeParse(body);
  if (parsed.success === false) {
    return Response.json({ error: parsed.error.message }, { status: 400 });
  }

  const { chatId, model, content } = parsed.data;

  // All database operations are batched and performed after streaming
  const batch: BatchItem<'pg'>[] = [];

  const [userExists, chatExists] = await Promise.all([
    db.query.users.findFirst({ where: (users, { eq }) => eq(users.userId, ctx.user!.userId) }),
    db.query.chats.findFirst({ where: (chats, { eq }) => eq(chats.chatId, chatId) }),
  ]);

  if (!userExists) {
    batch.push(db.insert(users).values({ userId: ctx.user!.userId, anon: true }).onConflictDoNothing());
    await setAuthTokenCookie({ userId: ctx.user!.userId, anon: true });
  }

  if (!chatExists) {
    batch.push(
      db.insert(chats).values({ chatId, userId: ctx.user!.userId, title: '' }).onConflictDoNothing()
    );
  }

  const messageUser: MessageUser = {
    messageId: uuid(),
    chatId,
    model,
    content,
    role: 'user',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const messageAssistant: MessageAssistant = {
    messageId: uuid(),
    chatId,
    parentId: messageUser.messageId,
    model,
    content: '',
    structured: null,
    role: 'assistant',
    status: 'pending',
    movies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  batch.push(db.insert(messages).values([messageUser, messageAssistant]));

  const messageHistory = chatExists
    ? await db.query.messages.findMany({
        where: (messages, { eq }) => eq(messages.chatId, chatId),
        orderBy: (messages, { asc }) => asc(messages.serial),
        columns: { role: true, content: true },
        limit: 20,
      })
    : [];

  const modelStream = streamText({
    model: getModel(model as Model),
    messages: [SYSTEM_CONTEXT_MESSAGE, ...messageHistory, { role: 'user', content }],
  });

  const responseStream = new ReadableStream({
    async start(controller) {
      const modelStreamReader = modelStream.textStream.getReader();

      controller.enqueue(encodeSSE({ type: 'message', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'message', v: messageAssistant }));

      let modelResponseContent = '';
      while (true) {
        const { done, value } = await modelStreamReader.read();
        if (done) break;

        modelResponseContent += value;
        controller.enqueue(encodeSSE({ type: 'content', v: value, id: messageAssistant.messageId }));
      }

      messageAssistant.content = modelResponseContent;
      messageAssistant.structured = modelResponseToStructured(modelResponseContent);

      await Promise.all(
        messageAssistant.structured.map(async (parsedOutput, index) => {
          const found = await tmdbFindMovie(parsedOutput.title, parsedOutput.releaseYear);
          if (!found) return;

          const source = await tmdbGetMovieById(found.id);
          if (!source) return;

          const movie: Movie = {
            movieId: source.id,
            tmdbId: source.id,
            source,
            createdAt: new Date(),
          };

          messageAssistant.structured![index].tmdbId = movie.tmdbId;
          messageAssistant.movies.push({ ...movie, liked: false, watched: false, watchlist: false });
        })
      );

      messageUser.status = 'done';
      messageAssistant.status = 'done';

      if (messageAssistant.movies.length > 0) {
        batch.push(
          db.insert(movies).values(messageAssistant.movies).onConflictDoNothing(),
          db.insert(messageMovies).values(
            messageAssistant.movies.map((movie) => ({
              messageId: messageAssistant.messageId,
              movieId: movie.movieId,
            }))
          )
        );
      }

      batch.push(
        db.update(messages).set(messageUser).where(eq(messages.messageId, messageUser.messageId)),
        db.update(messages).set(messageAssistant).where(eq(messages.messageId, messageAssistant.messageId))
      );

      controller.enqueue(encodeSSE({ type: 'message', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'message', v: messageAssistant }));

      if (!chatExists) {
        const chatTitle = await generateText({
          model: getModel('openai/gpt-4.1-nano'),
          prompt: `Generate a short title for this prompt in 3 words or less (don't use the word "movie"): "Movie picks for prompt: ${content}"`,
        });

        if (chatTitle.content[0].type === 'text') {
          batch.push(
            db.update(chats).set({ title: chatTitle.content[0].text }).where(eq(chats.chatId, chatId))
          );
        }
      }

      await db.batch(batch as [BatchItem<'pg'>, ...BatchItem<'pg'>[]]);

      controller.enqueue(encodeSSE({ type: 'end' }));
      controller.enqueue(encodeSSE('end'));

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
