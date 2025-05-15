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

  const filteredResults = data?.results
    ?.filter((movie) => {
      if (!movie.poster_path) return false;
      if (movie.popularity < 2) return false;

      return true;
    })
    .slice(0, 5);
  if (!filteredResults) {
    throw new Error('');
  }

  // TODO: This is a bit of a hack, but it works for now
  const withDirectors = await Promise.all(
    filteredResults.map(async (m) => {
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

  const formatted = withDirectors.map((movie) => ({
    movieId: movie.id as number,
    tmdbId: movie.id as number,
    title: movie.title as string,
    posterPath: movie.poster_path as string,
    directors: movie.directors as string[],
    createdAt: new Date(), // TODO: don't need this
    releaseDate: new Date(movie.release_date!),
  }));

  return c.json(formatted);
};
