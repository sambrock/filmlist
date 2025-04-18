import z from 'zod';

import { tmdb } from '@repo/tmdb';
import { procedure } from '../lib/trpc';

export const searchMovies = procedure
  .input(
    z.object({
      query: z.string(),
      year: z
        .string()
        .length(4)
        .regex(/^\d{4}$/)
        .optional(),
    })
  )
  .query(async ({ input }) => {
    const { data } = await tmdb.client.GET('/3/search/movie', {
      params: {
        query: {
          query: input.query,
          year: input.year,
          primary_release_year: input.year,
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

    return withDirectors.map((movie) => ({
      tmdbId: movie.id as number,
      title: movie.title as string,
      posterPath: movie.poster_path as string,
      directors: movie.directors as string[],
    }));
  });
