import createClient, { Middleware } from 'openapi-fetch';

import type { paths } from './api-v1';

const middleware: Middleware = {
  async onRequest({ request, options }) {
    // console.log(document.cookie);
    // const c = document.cookie
    // const clientToken = c.get('x-client-token')?.value;
    // if (clientToken) {
    //   console.log('CLIENT TOKEN', clientToken);
    //   request.headers.set('x-client-token', clientToken);
    // }
  },
  async onResponse({ request, response, options }) {},
  async onError({ error }) {},
};

export const api = createClient<paths>({ baseUrl: 'http://localhost:8787' });

api.use(middleware);
