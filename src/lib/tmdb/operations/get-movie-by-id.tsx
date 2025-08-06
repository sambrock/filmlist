import { cache } from 'react';

import { tmdb } from '../client';
import { MovieDetails } from '../types';

export const getMovieById = cache(async (movieId: number) => {
  const { data } = await tmdb.GET(`/3/movie/{movie_id}`, {
    params: {
      path: {
        movie_id: movieId,
      },
    },
  });

  if (!data || !data.id) {
    return null;
  }

  return data as MovieDetails;
});
