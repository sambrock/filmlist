import createClient from 'openapi-fetch';

import type { paths } from './api-schema-v1';

export const client = createClient<paths>({
  baseUrl: 'http://localhost:3001',
});