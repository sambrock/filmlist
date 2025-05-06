import { createRoute, z } from '@hono/zod-openapi';

import { STATUS_CODE } from '@/lib/constants';
import { jsonResponse } from '@/lib/openapi';

export const initializeClient = createRoute({
  path: '/initializeClient',
  method: 'post',
  responses: {
    [STATUS_CODE.OK]: jsonResponse(
      z.object({
        clientId: z.string(),
      })
    ),
  },
});

export type InitializeClientRoute = typeof initializeClient;
