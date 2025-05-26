import { MIN_TMDB_POPULARITY } from '@repo/lib/constants';
import { tmdb, type TMDBMovie } from '@repo/tmdb';
import { AppRouteHandler } from '@/lib/openapi';
import { SearchMoviesRoute } from '../movies.routes';

export const searchMovies: AppRouteHandler<SearchMoviesRoute> = async (c) => {
  const query = c.req.query();

  let searchBy: 'query' | 'director' = 'query';
  if (query.director) {
    searchBy = 'director';
  }

  switch (searchBy) {
    default:
    case 'query': {
      const searchMoviesQuery = await tmdb.client.GET('/3/search/movie', {
        params: {
          query: {
            query: query.q,
            year: query.year,
            primary_release_year: query.year,
          },
        },
      });

      if (!searchMoviesQuery.data || !searchMoviesQuery.data?.results) {
        throw Error('');
      }

      const filtered = filterTMDbMovies(searchMoviesQuery.data.results as TMDBMovie[]);

      const movieCredits = await Promise.all(
        filtered.map(async (movie) => {
          const creditsQuery = await tmdb.client.GET('/3/movie/{movie_id}/credits', {
            params: {
              path: { movie_id: movie.id },
            },
          });

          return creditsQuery.data;
        })
      );

      const formatted = filtered.map((movie) => ({
        movieId: movie.id,
        tmdbId: movie.id,
        title: movie.title!,
        posterPath: movie.poster_path!,
        releaseDate: new Date(movie.release_date!),
        createdAt: new Date(),
        directors: movieCredits
          .filter((credits) => credits?.id === movie.id)
          .map(
            (credits) => credits?.crew?.find((person) => person.job?.toLowerCase() === 'director')?.name || ''
          ),
      }));

      return c.json(formatted);
    }

    case 'director': {
      const searchPersonsQuery = await tmdb.client.GET('/3/search/person', {
        params: {
          query: {
            query: query.director,
          },
        },
      });

      if (!searchPersonsQuery.data || !searchPersonsQuery.data.results) {
        throw new Error('');
      }

      const person = searchPersonsQuery.data.results[0];

      const moviesCredits = await tmdb.client.GET('/3/person/{person_id}/movie_credits', {
        params: {
          path: { person_id: person.id },
        },
      });

      const directed = moviesCredits.data?.crew?.filter((movie) => movie.job?.toLowerCase() === 'director');

      const filtered = filterTMDbMovies(directed as TMDBMovie[]);

      const formatted = filtered.map((movie) => ({
        movieId: movie.id,
        tmdbId: movie.id,
        title: movie.title!,
        posterPath: movie.poster_path!,
        releaseDate: new Date(movie.release_date!),
        createdAt: new Date(),
        directors: [person.name!],
      }));

      return c.json(formatted);
    }
  }
};

export const filterTMDbMovies = (movies: TMDBMovie[]) => {
  return movies.filter((movie) => {
    if (
      movie.adult ||
      !movie.title ||
      !movie.release_date ||
      !movie.poster_path ||
      !movie.backdrop_path ||
      movie.popularity < MIN_TMDB_POPULARITY
    ) {
      return false;
    }

    return true;
  });
};
