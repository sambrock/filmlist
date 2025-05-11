import { RouteConfig, RouteHandler } from '@hono/zod-openapi';
import { ZodSchema } from 'zod';

import { AppBindings } from './config';

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;

export const jsonResponse = <Schema = ZodSchema>(schema: Schema, description = '') => {
  return {
    description,
    content: {
      'application/json': {
        schema,
      },
    },
  };
};

export const jsonBody = <Schema = ZodSchema>(schema: Schema, description = '') => {
  return {
    description,
    content: {
      'application/json': {
        schema,
      },
    },
  };
};
