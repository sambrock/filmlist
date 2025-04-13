import { drizzle } from 'drizzle-orm/d1';

import { listMovies, listMoviesRelations, ListMovie } from './schema/list-movies.schema';
import { listRelations, lists, List, ListInsert } from './schema/lists.schema';
import { movies, moviesRelations, Movie } from './schema/movies.schema';

export type DrizzleDatabase = ReturnType<typeof initDrizzleDatabase>;

export { listMovies, lists, movies, List, ListInsert, Movie, ListMovie };

export const initDrizzleDatabase = (binding: {}) => {
  return drizzle(binding, {
    logger: {
      logQuery: (msg) => {
        console.log(msg);
      },
    },
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
