import { createRoute, z } from '@hono/zod-openapi';

import { MovieSchema } from '@repo/drizzle';
import { STATUS_CODE } from '@/lib/constants';
import { jsonResponse } from '@/lib/openapi';

export const searchMovies = createRoute({
  path: '/search',
  method: 'get',
  request: {
    query: z.object({
      q: z.string(),
      year: z.string().optional(),
      director: z.string().optional(),
    }),
  },
  responses: {
    [STATUS_CODE.OK]: jsonResponse(
      MovieSchema.extend({
        directors: z.string().array(),
      }).array()
    ),
  },
});

export type SearchMoviesRoute = typeof searchMovies;
