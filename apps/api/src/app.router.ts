import { router } from './lib/trpc';
import { createListMovie } from './mutations/createListMovie.mutation';
import { findList } from './queries/findList.query';
import { searchMovies } from './queries/searchMovies.query';

export const appRouter = router({
  movies: {
    search: searchMovies,
  },

  list: {
    find: findList,
    add: createListMovie,
  },
});

export type AppRouter = typeof appRouter;
