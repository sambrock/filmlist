import { createRoute, z } from '@hono/zod-openapi';

import { ListMovieSchema, ListSchema, MovieSelectSchema } from '@repo/drizzle';
import { STATUS_CODE } from '@/lib/constants';
import { jsonResponse } from '@/lib/openapi';
import { dbMiddleware } from '@/middleware/db.middleware';
import { initializeClientMiddleware } from '@/middleware/initializeClient.middleware';
import { readClientId } from '@/middleware/readClientId.middleware';

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

export const getListInitialData = createRoute({
  path: '/getListInitialData',
  method: 'get',
  responses: {
    [STATUS_CODE.OK]: jsonResponse(
      z.object({
        list: ListSchema,
        listMovies: ListMovieSchema.array(),
        movies: MovieSelectSchema.array(),
      })
    ),
  },
  middleware: [dbMiddleware, readClientId],
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
export type GetListInitialDataRoute = typeof getListInitialData;
export type InitializeListRoute = typeof initializeList;
