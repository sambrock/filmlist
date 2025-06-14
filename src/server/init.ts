import { OpenAPIHono } from '@hono/zod-openapi';

export const createRouter = () => {
  return new OpenAPIHono({
    strict: false,
  }).basePath('/api');
};

export const createApp = () => {
  const app = createRouter();

  app.notFound((c) => c.text('Not Found', 404));
  app.onError((err) => {
    console.error('Error:', err);
    return new Response('Internal Server Error', { status: 500 });
  });

  return app;
};

// export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
//   return createApp().route('/', router);
// }
