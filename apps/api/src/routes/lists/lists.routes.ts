import { createRoute, z } from '@hono/zod-openapi';

import { ListMovieSchema, ListSchema, MovieSchema } from '@repo/drizzle';
import { STATUS_CODE } from '@/lib/constants';
import { jsonResponse } from '@/lib/openapi';
import { dbMiddleware } from '@/middleware/db.middleware';
import { initializeClientMiddleware } from '@/middleware/initializeClientToken.middleware';
import { readClientToken } from '@/middleware/readClientToken.middleware';

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

export const getInitialData = createRoute({
  path: '/getInitialData',
  method: 'get',
  request: {
    query: z.object({
      readId: z.string().optional(),
      editId: z.string().optional(),
    }),
  },
  responses: {
    [STATUS_CODE.OK]: jsonResponse(
      z.object({
        list: ListSchema,
        listMovies: ListMovieSchema.array(),
        movies: MovieSchema.array(),
      })
    ),
    [STATUS_CODE.NOT_FOUND]: jsonResponse(z.object({})),
  },
  middleware: [dbMiddleware, readClientToken],
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
export type GetInitialDataRoute = typeof getInitialData;
export type InitializeListRoute = typeof initializeList;
