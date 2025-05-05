import { createRoute, z } from '@hono/zod-openapi';
import { dbMiddleware } from '@/middleware/db.middleware';

import { listSelectSchema } from '@repo/drizzle';
import { STATUS_CODE } from '@/lib/constants';
import { jsonResponse } from '@/lib/openapi';

export const list = createRoute({
  path: '/findList/:id',
  method: 'get',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [STATUS_CODE.OK]: jsonResponse(listSelectSchema),
  },
  middleware: [dbMiddleware],
});

export type ListRoute = typeof list;
