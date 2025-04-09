import { procedure, router } from '../lib/trpc';
import { searchMoviesHandler, searchMoviesInputSchema } from './query-search-movies.handler';

export const movieRouter = router({
  searchMovies: procedure.input(searchMoviesInputSchema).query(async (opts) => {
    return searchMoviesHandler(opts.input);
  }),
});
