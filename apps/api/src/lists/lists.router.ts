import { authedProcedure, router } from '../lib/trpc';
import { addMovieToListHandler, addMovieToListInputSchema } from './mutation-add-movie.handler';

export const listRouter = router({
  addMovieToList: authedProcedure.input(addMovieToListInputSchema).mutation(async (opts) => {
    return addMovieToListHandler(opts.input, opts.ctx);
  }),
});
