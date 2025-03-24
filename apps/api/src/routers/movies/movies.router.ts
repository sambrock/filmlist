import { procedure, router } from '@/lib/trpc';
import { getMovieCastInput, getMovieInput, getMovieWatchProvidersInput } from './movies.schema';
import { getMovie, getMovieCast, getMovieWatchProviders } from './movies.service';

export const movieRouter = router({
  getMovie: procedure.input(getMovieInput).query(async (opts) => {
    return getMovie(opts.input, opts.ctx);
  }),

  getMovieCast: procedure.input(getMovieCastInput).query(async (opts) => {
    return getMovieCast(opts.input, opts.ctx);
  }),

  getMovieWatchProviders: procedure.input(getMovieWatchProvidersInput).query(async (opts) => {
    return getMovieWatchProviders(opts.input, opts.ctx);
  }),
});
