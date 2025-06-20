import { createRoute } from '@hono/zod-openapi';
import { streamSSE } from 'hono/streaming';
import { z } from 'zod';

import { AppRouteHandler } from '@/server/types';
import { db } from '@/lib/drizzle/db';
import { messages, messagesMovies, movies } from '@/lib/drizzle/schema';
import { openaiClient } from '@/lib/openai/client';
import { tmdbClient } from '@/lib/tmdb/client';
import { ChatMessage, Movie } from '@/lib/types';
import { baseMessage } from '@/lib/utils/chat';
import { findMoviesFromCompletionString } from '@/lib/utils/parse-completion';
import { HttpStatusCodes, jsonContent } from '@/lib/utils/server';
import { generateUuid } from '@/lib/utils/uuid';

const chatSchema = z.object({
  threadId: z.string(),
  content: z.string(),
  model: z.string(),
});

export const route = createRoute({
  path: '/chat',
  method: 'post',
  description: 'Returns streaming chat responses',
  request: {
    body: {
      content: jsonContent(chatSchema),
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: 'Chat response stream',
      content: {
        'text/event-stream': {
          schema: {
            type: 'string',
          },
        },
      },
    },
  },
});

export type EventStreamData =
  | { type: 'message'; v: ChatMessage }
  | { type: 'content'; id: string; v: string }
  | { type: 'movie'; id: string; v: Movie }
  | { type: 'end' };

export const handler: AppRouteHandler<typeof route> = async (c) => {
  const data = c.req.valid('json');

  const userMessage: ChatMessage = {
    messageId: generateUuid(),
    threadId: data.threadId,
    parentId: null,
    content: data.content,
    role: 'user',
    model: data.model,
    movies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const assistantMessage: ChatMessage = {
    messageId: generateUuid(),
    threadId: data.threadId,
    parentId: userMessage.messageId,
    content: '',
    role: 'assistant',
    model: data.model,
    movies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const completion = openaiClient.chat.completions.stream({
    model: data.model,
    messages: [{ role: userMessage.role, content: baseMessage(userMessage.content) }],
  });

  return streamSSE(c, async (stream) => {
    await stream.writeSSE({
      event: 'delta',
      data: JSON.stringify({ type: 'message', v: userMessage } satisfies EventStreamData),
    });

    completion.on('connect', async () => {
      await stream.writeSSE({
        event: 'delta',
        data: JSON.stringify({ type: 'message', v: assistantMessage } satisfies EventStreamData),
      });
    });

    completion.on('content', async (content) => {
      console.log('content', content);
      await stream.writeSSE({
        event: 'delta',
        data: JSON.stringify({
          type: 'content',
          id: assistantMessage.messageId,
          v: content,
        } satisfies EventStreamData),
      });
    });

    completion.on('finalContent', async (finalContent) => {
      assistantMessage.content = finalContent;
      assistantMessage.createdAt = new Date();
      assistantMessage.updatedAt = new Date();
    });

    completion.on('end', async () => {
      await stream.writeSSE({
        event: 'delta',
        data: JSON.stringify({ type: 'end' } satisfies EventStreamData),
      });

      await db.insert(messages).values(userMessage);
      await db.insert(messages).values(assistantMessage);

      const foundMovies = findMoviesFromCompletionString(assistantMessage.content);

      await Promise.all(
        foundMovies.map(async (found) => {
          const { data } = await tmdbClient.GET('/3/search/movie', {
            params: {
              query: {
                query: found.title,
                year: found.release_year ? String(found.release_year) : undefined,
                primary_release_year: found.release_year ? String(found.release_year) : undefined,
              },
            },
          });

          if (!data) return;
          if (!data.results || data.results?.length === 0) return;

          const [result] = data.results;

          const movie: Movie = {
            movieId: result.id,
            tmdbId: result.id,
            title: result.title!,
            backdropPath: result.backdrop_path!,
            posterPath: result.poster_path!,
            releaseDate: new Date(result.release_date!),
            createdAt: new Date(),
          };

          await stream.writeSSE({
            event: 'delta',
            data: JSON.stringify({
              type: 'movie',
              id: assistantMessage.messageId,
              v: movie,
            } satisfies EventStreamData),
          });

          await db.insert(movies).values(movie).onConflictDoNothing();

          await db.insert(messagesMovies).values({
            messageId: assistantMessage.messageId,
            movieId: movie.movieId,
            createdAt: new Date(),
          });
        })
      );

      await stream.close();
    });

    while (true) {
      await stream.sleep(100000); // Keep stream alive
    }
  });
};
