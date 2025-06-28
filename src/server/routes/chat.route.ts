import { createRoute } from '@hono/zod-openapi';
import { streamSSE } from 'hono/streaming';
import { z } from 'zod';

import { AppRouteHandler } from '@/server/types';
import { db } from '@/lib/drizzle/db';
import { messages } from '@/lib/drizzle/schema';
import { Movie } from '@/lib/drizzle/zod';
import { openai } from '@/lib/openai/client';
import { baseMessage, parseMoviesFromMessage } from '@/lib/utils/chat.utils';
import { HttpStatusCodes, jsonContent } from '@/lib/utils/openapi.utils';
import { generateUuid } from '@/lib/utils/uuid.util';

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

export type EventStreamData =
  | { type: 'content'; v: string }
  | { type: 'movie'; id: string; v: Movie }
  | { type: 'end' };

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

    chatStream.on('content', async (content) => {
      content += content;

      await stream.writeSSE({
        event: 'delta',
        data: JSON.stringify({ type: 'content', v: content } satisfies EventStreamData),
      });

      parseMoviesFromMessage(content, foundMovies);
    });

    chatStream.on('finalContent', async (finalContent) => {
      const userMessageId = generateUuid();
      const assistantMessageId = generateUuid();

      await db.insert(messages).values([
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
          content: finalContent,
          model: data.model,
          role: 'assistant',
        },
      ]);

      await stream.writeSSE({
        event: 'delta',
        data: JSON.stringify({ type: 'end' } satisfies EventStreamData),
      });
    });

    chatStream.on('end', async () => {
      await stream.close();
    });

    // completion.on('finalContent', async (finalContent) => {
    //   assistantMessage.content = finalContent;
    //   assistantMessage.createdAt = new Date();
    //   assistantMessage.updatedAt = new Date();
    // });

    // completion.on('end', async () => {
    //   await stream.writeSSE({
    //     event: 'delta',
    //     data: JSON.stringify({ type: 'end' } satisfies EventStreamData),
    //   });

    //   await db.insert(messages).values(userMessage);
    //   await db.insert(messages).values(assistantMessage);

    //   const foundMovies = findMoviesFromCompletionString(assistantMessage.content);

    //   await Promise.all(
    //     foundMovies.map(async (found) => {
    //       const { data } = await tmdb.GET('/3/search/movie', {
    //         params: {
    //           query: {
    //             query: found.title,
    //             year: found.release_year ? String(found.release_year) : undefined,
    //             primary_release_year: found.release_year ? String(found.release_year) : undefined,
    //           },
    //         },
    //       });

    //       if (!data) return;
    //       if (!data.results || data.results?.length === 0) return;

    //       const [result] = data.results;

    //       const movie: Movie = {
    //         movieId: result.id,
    //         tmdbId: result.id,
    //         title: result.title!,
    //         backdropPath: result.backdrop_path!,
    //         posterPath: result.poster_path!,
    //         releaseDate: new Date(result.release_date!),
    //         createdAt: new Date(),
    //       };

    //       await stream.writeSSE({
    //         event: 'delta',
    //         data: JSON.stringify({
    //           type: 'movie',
    //           id: assistantMessage.messageId,
    //           v: movie,
    //         } satisfies EventStreamData),
    //       });

    //       await db.insert(movies).values(movie).onConflictDoNothing();

    //       await db.insert(messagesMovies).values({
    //         messageId: assistantMessage.messageId,
    //         movieId: movie.movieId,
    //         createdAt: new Date(),
    //       });
    //     })
    //   );

    //   await stream.close();
    // });

    while (true) {
      await stream.sleep(100000); // Keep stream alive
    }
  });
};
