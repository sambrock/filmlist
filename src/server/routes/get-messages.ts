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
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: z.object({
            messages: z.object({}).array(),
            nextCursor: z.nullable(z.string()).optional(),
          }),
        },
      },
      description: '',
    },
  },
});

export const handler: AppRouteHandler<typeof route> = async (c) => {
  const { threadId } = c.req.valid('param');


  const messages = await db.query.messages.findMany({
    where: (messages, { eq }) => eq(messages.threadId, threadId),
    orderBy: (messages, { desc }) => [desc(messages.createdAt)],
    with: {
      messageMovies: {
        with: {
          movie: true,
        },
      },
    },
    limit: 20,
  });

  const messagesWithMovies = messages.map(({ messageMovies, ...message }) => ({
    ...message,
    movies: messageMovies.map((mm) => mm.movie),
  }));

  return c.json({ messages: messagesWithMovies, nextCursor: null });
};
