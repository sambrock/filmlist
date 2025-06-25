import createClient from 'openapi-fetch';

import { env } from '../env';
import { paths } from './tmdb-api-v3';

export const tmdb = createClient<paths>({
  baseUrl: 'https://api.themoviedb.org',
  headers: {
    Authorization: `Bearer ${env.TMDB_API_KEY}`,
  },
});
