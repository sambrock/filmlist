import { createRoute, z } from '@hono/zod-openapi';

import { db } from '@/lib/drizzle/db';
import { HttpStatusCodes } from '@/lib/utils/server';
import { AppRouteHandler } from '../types';

export const route = createRoute({
  path: '/messages/{threadId}',
  method: 'get',
  request: {
    params: z.object({
      threadId: z.string(),
    }),
    query: z.object({
      limit: z.coerce.number().optional().default(20),
      cursor: z.coerce
        .number()
        .optional()
        .default(() => Date.now()),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: z.object({
            messages: z.array(
              z.object({
                messageId: z.string(),
                threadId: z.string(),
                content: z.string(),
                createdAt: z.string().datetime(),
                updatedAt: z.string().datetime(),
                movies: z.array(
                  z.object({
                    title: z.string(),
                    createdAt: z.string().datetime(),
                    releaseDate: z.string().datetime(),
                    movieId: z.string(),
                    tmdbId: z.number(),
                    posterPath: z.string(),
                    backdropPath: z.string().optional(),
                  })
                ),
              })
            ),
            nextCursor: z.nullable(z.number()).optional(),
          }),
        },
      },
      description: '',
    },
  },
});

export const handler: AppRouteHandler<typeof route> = async (c) => {
  const { threadId } = c.req.valid('param');
  const { limit, cursor } = c.req.valid('query');

  const searchCursor = cursor ? new Date(cursor) : new Date();

  const messages = await db.query.messages.findMany({
    where: (messages, { and, eq, lt }) =>
      and(eq(messages.threadId, threadId), lt(messages.createdAt, searchCursor)),
    orderBy: (messages, { desc }) => [desc(messages.createdAt)],
    with: {
      messageMovies: {
        with: {
          movie: true,
        },
      },
    },
    limit,
  });

  const messagesWithMovies = messages.map(({ messageMovies, ...message }) => ({
    ...message,
    movies: messageMovies.map((mm) => mm.movie),
  }));

  return c.json({
    messages: messagesWithMovies,
    nextCursor: messages.length > 0 ? messages[messages.length - 1].createdAt.getTime() : null,
  });
};
