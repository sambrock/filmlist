import { tmdb } from '@repo/tmdb';
import { AppRouteHandler } from '@/lib/openapi';

import { SearchMoviesRoute } from '../movies.routes';

export const searchMovies: AppRouteHandler<SearchMoviesRoute> = async (c) => {
  const query = c.req.query();

  const { data } = await tmdb.client.GET('/3/search/movie', {
    params: {
      query: {
        query: query.q,
        year: query.year,
        primary_release_year: query.year,
        append_to_response: 'credits',
      },
    },
  });

  const results = data?.results?.slice(0, 5);
  if (!results) {
    throw new Error('');
  }

  // TODO: This is a bit of a hack, but it works for now
  const withDirectors = await Promise.all(
    results.map(async (m) => {
      const { data } = await tmdb.client.GET('/3/movie/{movie_id}/credits', {
        params: {
          path: { movie_id: m.id },
        },
      });
      return {
        ...m,
        directors:
          data?.crew?.filter((person) => person.job === 'Director').map((person) => person.name) || [],
      };
    })
  );

  return c.json(
    withDirectors.map((movie) => ({
      tmdbId: movie.id as number,
      title: movie.title as string,
      posterPath: movie.poster_path as string,
      directors: movie.directors as string[],
    }))
  );
};
