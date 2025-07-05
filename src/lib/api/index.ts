import createClient from 'openapi-fetch';

import { paths } from './api';

export const api = createClient<paths>({
  baseUrl: 'http://localhost:3000',
  headers: {
    Authorization: `Bearer `,
  },
});
