import createClient from 'openapi-fetch';

import { env } from '../env';
import { paths } from './schema-v3';

export const tmdb = createClient<paths>({
  baseUrl: 'https://api.themoviedb.org',
  headers: {
    Authorization: `Bearer ${env.TMDB_API_KEY}`,
  },
});
