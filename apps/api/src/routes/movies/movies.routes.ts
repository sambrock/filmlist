import { createRoute, z } from '@hono/zod-openapi';

import { STATUS_CODE } from '@/lib/constants';
import { jsonResponse } from '@/lib/openapi';

export const searchMovies = createRoute({
  path: '/search',
  method: 'get',
  responses: {
    [STATUS_CODE.OK]: jsonResponse(
      z
        .object({
          title: z.string(),
        })
        .array()
    ),
  },
});

export type SearchMoviesRoute = typeof searchMovies;
