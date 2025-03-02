import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import { getMovie, getMovieCast } from './movie.service';

const t = initTRPC.create();

export const router = t.router({
  /* Queries */

  getMovie: t.procedure.input(z.object({ movieId: z.number() })).query(async (opts) => {
    const { movieId } = opts.input;
    return getMovie(movieId);
  }),

  getMovieCast: t.procedure.input(z.object({ movieId: z.number() })).query(async (opts) => {
    const { movieId } = opts.input;
    return getMovieCast(movieId);
  }),
});
