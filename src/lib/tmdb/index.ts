import createClient from 'openapi-fetch';

import { env } from '../env';
import { paths } from './tmdb-api-v3';

export const tmdb = createClient<paths>({
  baseUrl: 'https://api.themoviedb.org',
  headers: {
    Authorization: `Bearer ${env.TMDB_API_KEY}`,
  },
});

export const findMovie = async (query: string, year: string) => {
  const { data } = await tmdb.GET('/3/search/movie', {
    params: {
      query: {
        query,
        year,
        primary_release_year: year,
      },
    },
  });

  if (!data || !data.results || data.results.length === 0) {
    return null;
  }

  const [result] = data.results;

  if (!result.id || !result.title || !result.release_date || !result.backdrop_path || !result.poster_path) {
    return null;
  }

  return result;
};
