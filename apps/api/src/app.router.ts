import { router } from './lib/trpc';
import { createListMovie } from './mutations/createListMovie.mutation';
import { initializeList } from './mutations/initializeList.mutation';
import { removeListMovie } from './mutations/removeListMovie.mutation';
import { loadList } from './queries/loadList.query';
import { searchMovies } from './queries/searchMovies.query';

export const appRouter = router({
  movies: {
    search: searchMovies,
  },

  list: {
    initialize: initializeList,
    load: loadList,
    add: createListMovie,
    remove: removeListMovie,
  },
});

export type AppRouter = typeof appRouter;
