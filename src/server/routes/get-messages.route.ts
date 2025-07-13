import { createRoute, z } from '@hono/zod-openapi';

import { db } from '@/lib/drizzle/db';
import { MessageMovieSchema, MessageSchema, MovieSchema } from '@/lib/drizzle/zod';
import { HttpStatusCodes, jsonContent } from '@/lib/utils/server.utils';
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
      cursor: z.coerce.number().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: jsonContent(
        z.object({
          messages: z
            .object({
              message: MessageSchema,
              movies: MessageMovieSchema.extend({ movie: MovieSchema }).array(),
            })
            .array(),
          nextCursor: z.number(),
        })
      ),
      description: '',
    },
  },
});

export const handler: AppRouteHandler<typeof route> = async (c) => {
  const { threadId } = c.req.valid('param');
  const { limit, cursor } = c.req.valid('query');

  const messagesWithMovies = await db.query.messages.findMany({
    where: (messages, { and, eq, lt }) =>
      and(eq(messages.threadId, threadId), cursor ? lt(messages.serial, cursor) : undefined),
    orderBy: (messages, { desc }) => [desc(messages.serial)],
    with: {
      movies: {
        with: {
          movie: true,
        },
      },
    },
    limit,
  });

  return c.json({
    messages: messagesWithMovies.map((messageWithMovies) => {
      const { movies, ...message } = messageWithMovies;
      return { message, movies };
    }),
    nextCursor: messagesWithMovies.length > 0 ? messagesWithMovies[messagesWithMovies.length - 1].serial : 0,
  });
};
