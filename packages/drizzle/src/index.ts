import { drizzle } from 'drizzle-orm/d1';

import { listMovies, listMoviesRelations } from './schema/list-movies.schema';
import { listRelations, lists } from './schema/lists.schema';
import { movies, moviesRelations } from './schema/movies.schema';

export type DrizzleDatabase = ReturnType<typeof initDrizzleDatabase>;

export const initDrizzleDatabase = (binding: {}) => {
  return drizzle(binding, {
    schema: {
      listMovies,
      listMoviesRelations,

      lists,
      moviesRelations,

      movies,
      listRelations,
    },
  });
};

export { listMovies, lists, movies };
