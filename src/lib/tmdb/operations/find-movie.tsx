import { tmdb } from '../client';

export const findMovie = async (query: string, year: string) => {
  const search = await tmdb.GET('/3/search/movie', {
    params: {
      query: {
        query,
        year,
        primary_release_year: year,
      },
    },
  });

  if (!search.data || !search.data.results || search.data.results.length === 0) {
    return null;
  }

  const [result] = search.data.results;

  if (!result.id || !result.title || !result.release_date || !result.backdrop_path || !result.poster_path) {
    return null;
  }

  return result;
};
