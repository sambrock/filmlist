import { tmdb } from '../client';
import { TMDbCredits, TMDbMovieWithDirector } from '../types';

export const getMovieById = async (movieId: number) => {
  const { data } = await tmdb.GET(`/3/movie/{movie_id}`, {
    params: {
      path: {
        movie_id: movieId,
      },
      query: {
        append_to_response: 'credits',
      },
    },
  });

  if (!data || !data.id) {
    return null;
  }

  const { credits, ...movie } = data as TMDbMovieWithDirector & { credits: TMDbCredits };
  const director = credits.crew
    ?.filter((c) => c.job === 'Director')
    .map((c) => c.name)
    .join(', ');

  const movieWithDirector = { ...movie, director } as TMDbMovieWithDirector;

  return movieWithDirector;
};
