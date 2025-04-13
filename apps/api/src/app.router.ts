import { router } from './lib/trpc';
import { createListMovie } from './mutations/createListMovie.mutation';
import { initializeList } from './mutations/initializeList.mutation';
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
  },
});

export type AppRouter = typeof appRouter;
