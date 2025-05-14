import { createRoute, z } from '@hono/zod-openapi';

import { STATUS_CODE } from '@/lib/constants';
import { jsonResponse } from '@/lib/openapi';
import { dbMiddleware } from '@/middleware/db.middleware';

export const savePatches = createRoute({
  path: '/savePatches',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              op: z.enum(['add', 'remove', 'replace']),
              path: z.tuple([z.enum(['list', 'movies', 'listMovies']), z.any()]),
              value: z.any(),
            })
            .array()
            .array(),
        },
      },
    },
  },
  responses: {
    [STATUS_CODE.OK]: jsonResponse(z.object({})),
  },
  middleware: [dbMiddleware],
});

export type SavePatchesRoute = typeof savePatches;
