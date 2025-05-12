import { createRoute, z } from '@hono/zod-openapi';

import { ListSchema } from '@repo/drizzle';
import { STATUS_CODE } from '@/lib/constants';
import { jsonResponse } from '@/lib/openapi';
import { dbMiddleware } from '@/middleware/db.middleware';
import { initializeClientMiddleware } from '@/middleware/initializeClient.middleware';

export const findList = createRoute({
  path: '/findList/{listId}',
  method: 'get',
  request: {
    params: z.object({
      listId: z.string(),
    }),
  },
  responses: {
    [STATUS_CODE.OK]: jsonResponse(ListSchema),
  },
  middleware: [dbMiddleware],
});

export const initializeList = createRoute({
  path: '/initializeList',
  method: 'post',
  responses: {
    [STATUS_CODE.CREATED]: jsonResponse(ListSchema),
  },
  middleware: [dbMiddleware, initializeClientMiddleware],
});

export type FindListRoute = typeof findList;
export type InitializeListRoute = typeof initializeList;
