import { cors } from 'hono/cors';
import { OpenAPIHono } from '@hono/zod-openapi';
import { Scalar } from '@scalar/hono-api-reference';

import type { DrizzleDatabase } from '@repo/drizzle';

import { API_DOCS_JSON_PATH, API_DOCS_PATH, API_DOCS_TITLE, API_DOCS_VERSION } from './constants';

export interface AppBindings {
  Bindings: {
    DB: {}; // Cloudflare D1
    db: DrizzleDatabase; // Drizzle database
    JWT_SECRET: string;
  };
  Variables: {
    clientId: string;
  };
}

export const createRouter = () => {
  return new OpenAPIHono<AppBindings>();
};

export const createApp = (): OpenAPIHono<AppBindings> => {
  const app = new OpenAPIHono<AppBindings>().basePath('/v1');

  app.use(cors({ origin: 'http://localhost:3000' }));

  app
    .onError((err, c) => {
      console.log('Error:', err);
      return c.json(
        {
          message: 'Internal Server Error',
          error: err,
          stack: err.stack,
        },
        500
      );
    })
    .notFound((c) => {
      return c.json({
        message: `Not Found - ${c.req.path}`,
      });
    });

  return app;
};

export const enableOpenApiDocs = (app: OpenAPIHono<AppBindings>) => {
  app.doc(API_DOCS_JSON_PATH, {
    openapi: '3.0.0',
    info: {
      version: API_DOCS_VERSION,
      title: API_DOCS_TITLE,
    },
  });

  app.get(
    API_DOCS_PATH,
    Scalar({
      url: '/v1' + API_DOCS_JSON_PATH,
      layout: 'classic',
      defaultHttpClient: {
        targetKey: 'node',
        clientKey: 'fetch',
      },
    })
  );
};
