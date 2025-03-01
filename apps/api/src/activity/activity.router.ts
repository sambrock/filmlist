import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import { getUserMovieActivity, likeMovie, rateMovie, watchMovie } from './activity.service';

const t = initTRPC.create();

export const router = t.router({
  /* Queries */

  getUserMovieActivity: t.procedure
    .input(z.object({ movieId: z.number(), userId: z.number() }))
    .query(async (opts) => {
      const { movieId, userId } = opts.input;
      return getUserMovieActivity(movieId, userId);
    }),

  /* Mutations */

  watchMovie: t.procedure
    .input(z.object({ movieId: z.number(), userId: z.number(), watched: z.boolean() }))
    .mutation(async (opts) => {
      const { movieId, userId, watched } = opts.input;
      return watchMovie(movieId, userId, watched);
    }),

  likeMovie: t.procedure
    .input(z.object({ movieId: z.number(), userId: z.number(), liked: z.boolean() }))
    .mutation(async (opts) => {
      const { movieId, userId, liked } = opts.input;
      return likeMovie(movieId, userId, liked);
    }),

  rateMovie: t.procedure
    .input(z.object({ movieId: z.number(), userId: z.number(), rating: z.number() }))
    .mutation(async (opts) => {
      const { movieId, userId, rating } = opts.input;
      return rateMovie(movieId, userId, rating);
    }),
});
