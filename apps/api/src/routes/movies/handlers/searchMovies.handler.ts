import { tmdb, type TMDBOperations } from '@repo/tmdb';
import { AppRouteHandler } from '@/lib/openapi';
import { SearchMoviesRoute } from '../movies.routes';

type Movie = TMDBOperations['movie-details']['responses']['200']['content']['application/json'];
// type SearchMovieResultsWithDirector = (SearchMovieResults[number] & { directors: (string | undefined)[] })[];
// // type MovieCredits = NonNullable<
// //   TMDBOperations['movie-credits']['responses']['200']['content']['application/json']
// // >;

type MovieResult = {
  id: number;
  title: string;
  releaseDate: string;
  posterPath: string;
  directors: (string | undefined)[];
};

export const searchMovies: AppRouteHandler<SearchMoviesRoute> = async (c) => {
  const query = c.req.query();

  let movies: MovieResult[] = [];

  if (query.director) {
    movies = await searchMoviesByDirector(query.director);
  }

  if (!query.director) {
    movies = await searchMoviesByQuery(query.q, query.year);
  }

  return c.json(
    movies.map((m) => ({
      ...m,
      tmdbId: m.id,
      movieId: m.id,
      id: m.id,
    }))
  );
};

const searchMoviesByQuery = async (query: string, year: string): Promise<MovieResult[]> => {
  const { data } = await tmdb.client.GET('/3/search/movie', {
    params: {
      query: {
        query,
        year,
        primary_release_year: year,
      },
    },
  });

  if (!data?.results) {
    throw new Error('');
  }

  const withDirectors = await Promise.all(
    filterResults(data.results as Movie[]).map(async (movie) => {
      const { data } = await tmdb.client.GET('/3/movie/{movie_id}/credits', {
        params: {
          path: { movie_id: movie.id },
        },
      });

      return {
        ...movie,
        directors:
          data?.crew?.filter((person) => person.job === 'Director').map((person) => person.name) || [],
      };
    })
  );

  return withDirectors.map((movie) => ({
    id: movie.id,
    title: movie.title as string,
    posterPath: movie.poster_path as string,
    releaseDate: movie.release_date as string,
    directors: movie.directors,
  }));
};

const searchMoviesByDirector = async (query: string): Promise<MovieResult[]> => {
  const directorQuery = await tmdb.client.GET('/3/search/person', {
    params: {
      query: {
        query,
      },
    },
  });

  if (!directorQuery.data?.results) {
    throw new Error('');
  }

  const director = directorQuery.data.results[0];

  const moviesQuery = await tmdb.client.GET('/3/person/{person_id}/movie_credits', {
    params: {
      path: {
        person_id: director.id,
      },
    },
  });

  if (!moviesQuery.data?.crew) {
    throw new Error('');
  }

  const unique = [...new Set(moviesQuery.data.crew.map((m) => m.id))];

  return filterResults(unique.map((id) => moviesQuery.data.crew?.find((m) => m.id === id)) as Movie[]).map(
    (movie) => ({
      id: movie.id,
      title: movie.title as string,
      posterPath: movie.poster_path as string,
      releaseDate: movie.release_date as string,
      directors: [director.name],
    })
  );
};

const filterResults = (results: Movie[]) => {
  return results.filter((movie) => {
    if (!movie.poster_path) return false;
    if (movie.popularity < 1) return false;

    return true;
  });
};
