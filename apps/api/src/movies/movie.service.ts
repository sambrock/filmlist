import { tmdb, type TMDBOperations } from '@filmlist/tmdb';

export const getMovie = async (movieId: number) => {
  const { data } = await tmdb.client.GET('/3/movie/{movie_id}', {
    params: {
      path: { movie_id: movieId },
      query: {
        append_to_response: 'credits',
      },
    },
  });

  if (!data) {
    throw new Error('');
  }

  if ([data.poster_path, data.backdrop_path, data.release_date].includes(undefined)) {
    throw new Error('');
  }

  const credits = (
    data as unknown as {
      credits: TMDBOperations['movie-credits']['responses']['200']['content']['application/json']; // TODO
    }
  ).credits;

  return {
    movieId: data.id as number,
    title: data.title as string,
    posterPath: data.poster_path as string,
    releaseDate: data.release_date as string,
    backdropPath: data.backdrop_path as string,
    overview: data.overview as string,
    runtime: data.runtime as number,
    tagline: data.tagline as string,
    voteAverage: data.vote_average as number,
    voteCount: data.vote_count as number,
    directors: credits.crew
      ? credits.crew.filter((person) => person.job === 'Director').map((person) => person.name as string)
      : [],
    genres: data.genres ? data.genres?.map((genre) => genre.name as string) : [],
  };
};

export const getMovieCast = async (movieId: number) => {
  const { data } = await tmdb.client.GET('/3/movie/{movie_id}/credits', {
    params: {
      path: { movie_id: movieId },
    },
  });

  if (!data) {
    throw new Error('');
  }
  if (!data.cast) {
    return [];
  }

  return data.cast.map((person) => ({
    id: person.id as number,
    character: person.character as string,
    name: person.name as string,
    profilePath: person.profile_path as string,
  }));
};
