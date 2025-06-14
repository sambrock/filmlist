import { createRoute, z } from '@hono/zod-openapi';

import { db } from '@/lib/drizzle/db';
import { HttpStatusCodes } from '@/lib/utils/server';
import { AppRouteHandler } from '../types';

export const route = createRoute({
  path: '/threads',
  method: 'get',
  request: {
    query: z.object({
      userId: z.string().uuid(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: z.object({}),
        },
      },
      description: '',
    },
  },
});

export const handler: AppRouteHandler<typeof route> = async (c) => {
  const { userId } = c.req.valid('query');

  const threads = await db.query.threads.findMany({
    where: (threads, { eq }) => eq(threads.ownerId, userId),
    orderBy: (threads, { desc }) => [desc(threads.createdAt)],
  });

  return c.json(threads);
};
