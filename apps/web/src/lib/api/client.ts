import createClient, { Middleware } from 'openapi-fetch';

import type { paths } from './api-v1';

const middleware: Middleware = {
  async onRequest() {},
  async onResponse() {},
  async onError() {},
};

export const api = createClient<paths>({ baseUrl: 'http://localhost:8787' });

api.use(middleware);
