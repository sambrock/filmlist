import { authedProcedure, router } from '@/lib/trpc';
import {
  getUserMovieActivityInput,
  likeMovieInput,
  rateMovieInput,
  watchMovieInput,
} from './activity.schema';
import { getUserMovieActivity, likeMovie, rateMovie, watchMovie } from './activity.service';

export const activityRouter = router({
  getUserMovieActivity: authedProcedure.input(getUserMovieActivityInput).query(async (opts) => {
    return getUserMovieActivity(opts.input, opts.ctx);
  }),

  watchMovie: authedProcedure.input(watchMovieInput).mutation(async (opts) => {
    return watchMovie(opts.input, opts.ctx);
  }),

  likeMovie: authedProcedure.input(likeMovieInput).mutation(async (opts) => {
    return likeMovie(opts.input, opts.ctx);
  }),

  rateMovie: authedProcedure.input(rateMovieInput).mutation(async (opts) => {
    return rateMovie(opts.input, opts.ctx);
  }),
});
