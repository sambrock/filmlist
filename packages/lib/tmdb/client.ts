import createClient from 'openapi-fetch';

import type { paths, components } from './tmdb-schema-v3';

export type ApiSchema = components['schemas'];

export const client = createClient<paths>({
  baseUrl: 'https://www.themoviedb.org/',
  headers: {
    Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
  },
});