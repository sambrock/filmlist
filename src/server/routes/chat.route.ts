import { createRoute, z } from '@hono/zod-openapi';
import { streamSSE } from 'hono/streaming';

import { AppRouteHandler } from '@/server/types';
import { db } from '@/lib/drizzle/db';
import { messageMovies, messages, movies } from '@/lib/drizzle/schema';
import { openai } from '@/lib/openai';
import { findMovie } from '@/lib/tmdb';
import { chatEventStreamData, findMoviesInContent } from '@/lib/utils/chat.utils';
import { baseMessage } from '@/lib/utils/message.utils';
import { generateUuid, HttpStatusCodes, jsonContent } from '@/lib/utils/server.utils';

export const route = createRoute({
  path: '/chat',
  method: 'post',
  description: 'Returns streaming chat responses',
  request: {
    body: {
      content: jsonContent(
        z.object({
          threadId: z.string().uuid(),
          model: z.string(),
          content: z.string(),
        })
      ),
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

export const handler: AppRouteHandler<typeof route> = async (c) => {
  const data = c.req.valid('json');

  const chatStream = openai.chat.completions.stream({
    model: data.model,
    messages: [
      {
        role: 'user',
        content: baseMessage(data.content),
      },
    ],
  });

  return streamSSE(c, async (stream) => {
    const foundMovies = new Map<number, { title: string; releaseYear: string }>([]);

    let contentSoFar = '';

    chatStream.on('content', async (content) => {
      console.log('content', content);
      await stream.writeSSE({
        event: 'delta',
        data: JSON.stringify(chatEventStreamData({ type: 'content', v: content })),
      });
      contentSoFar += content;
      findMoviesInContent(contentSoFar, foundMovies);
    });

    chatStream.on('finalContent', async (finalContent) => {
      contentSoFar = finalContent;
    });

    chatStream.on('end', async () => {
      const userMessageId = generateUuid();
      const assistantMessageId = generateUuid();

      const [userMessage, assistantMessage] = await db
        .insert(messages)
        .values([
          {
            messageId: userMessageId,
            threadId: data.threadId,
            content: data.content,
            model: data.model,
            role: 'user',
          },
          {
            messageId: assistantMessageId,
            threadId: data.threadId,
            parentId: userMessageId,
            content: contentSoFar,
            model: data.model,
            role: 'assistant',
          },
        ])
        .returning();

      // TODO: make these a single event?
      await stream.writeSSE({
        event: 'delta',
        data: JSON.stringify(chatEventStreamData({ type: 'message', v: userMessage })),
      });
      await stream.writeSSE({
        event: 'delta',
        data: JSON.stringify(chatEventStreamData({ type: 'message', v: assistantMessage })),
      });
      await stream.writeSSE({
        event: 'delta',
        data: JSON.stringify(chatEventStreamData({ type: 'end' })),
      });

      await Promise.all(
        [...foundMovies.values()].entries().map(async ([, found]) => {
          const movie = await findMovie(found.title, found.releaseYear);
          if (!movie) return undefined;

          const [inserted] = await db
            .insert(movies)
            .values({
              movieId: generateUuid(),
              tmdbId: movie.id,
              title: movie.title!,
              backdropPath: movie.backdrop_path!,
              posterPath: movie.poster_path!,
              releaseDate: new Date(movie.release_date!),
            })
            .returning()
            .onConflictDoNothing();

          await stream.writeSSE({
            event: 'delta',
            data: JSON.stringify(chatEventStreamData({ type: 'movie', v: inserted })),
          });

          await db
            .insert(messageMovies)
            .values({
              messageId: assistantMessageId,
              movieId: inserted.movieId,
            })
            .onConflictDoNothing();
        })
      );

      await stream.close();
    });

    while (true) {
      await stream.sleep(100000); // Keep stream alive
    }
  });
};
