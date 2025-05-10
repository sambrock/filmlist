import { createRoute, z } from '@hono/zod-openapi';

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
      z
        .object({
          title: z.string(),
          tmdbId: z.number(),
          posterPath: z.string(),
          directors: z.string().array(),
          releaseDate: z.date()
        })
        .array()
    ),
  },
});

export type SearchMoviesRoute = typeof searchMovies;
