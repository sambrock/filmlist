import { createRoute, z } from '@hono/zod-openapi';
import { streamSSE } from 'hono/streaming';

import { AppRouteHandler } from '@/server/types';
import { db } from '@/lib/drizzle/db';
import { messageMovies, messages, movies } from '@/lib/drizzle/schema';
import { openai } from '@/lib/openai';
import { findMovie } from '@/lib/tmdb';
import { chatEventStreamData, parseMessageContentToMovies } from '@/lib/utils/chat.utils';
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

  const completionStream = openai.chat.completions.stream({
    model: data.model,
    messages: [
      {
        role: 'user',
        content: baseMessage(data.content),
      },
    ],
  });

  return streamSSE(c, async (stream) => {
    let contentSoFar = '';

    completionStream.on('content', async (content) => {
      console.log('content', content);
      await stream.writeSSE({
        event: 'delta',
        data: JSON.stringify(chatEventStreamData({ type: 'content', v: content })),
      });
      contentSoFar += content;
    });

    completionStream.on('finalContent', async (finalContent) => {
      contentSoFar = finalContent;
    });

    completionStream.on('end', async () => {
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

      const parsed = parseMessageContentToMovies(contentSoFar);

      await Promise.all(
        parsed.map(async (parsedMovie, index) => {
          const found = await findMovie(parsedMovie.title, parsedMovie.releaseYear);
          if (!found) return undefined;

          const movie = {
            movieId: generateUuid(),
            tmdbId: found.id,
            title: found.title!,
            backdropPath: found.backdrop_path!,
            posterPath: found.poster_path!,
            releaseDate: new Date(found.release_date!),
            createdAt: new Date(),
          };

          await stream.writeSSE({
            event: 'delta',
            data: JSON.stringify(chatEventStreamData({ type: 'movie', v: movie, i: index })),
          });

          await db.insert(movies).values(movie).returning().onConflictDoNothing();

          await db
            .insert(messageMovies)
            .values({
              messageId: assistantMessageId,
              movieId: movie.movieId,
              title: parsedMovie.title,
              releaseYear: parsedMovie.releaseYear,
              why: parsedMovie.why,
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
