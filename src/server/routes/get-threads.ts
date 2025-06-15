import { createRoute, z } from '@hono/zod-openapi';

import { db } from '@/lib/drizzle/db';
import { HttpStatusCodes } from '@/lib/utils/server';
import { AppRouteHandler } from '../types';

export const route = createRoute({
  path: '/user-threads/{userId}',
  method: 'get',
  request: {
    params: z.object({
      userId: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: z.array(
            z.object({
              threadId: z.string(),
              ownerId: z.string(),
              title: z.string(),
              model: z.string(),
              createdAt: z.string().datetime(),
              updatedAt: z.string().datetime(),
            })
          ),
        },
      },
      description: '',
    },
  },
});

export const handler: AppRouteHandler<typeof route> = async (c) => {
  const { userId } = c.req.valid('param');

  const threads = await db.query.threads.findMany({
    where: (threads, { eq }) => eq(threads.ownerId, userId),
    orderBy: (threads, { desc }) => [desc(threads.createdAt)],
  });

  return c.json(threads);
};
