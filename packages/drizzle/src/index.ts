import { drizzle } from 'drizzle-orm/d1';

import { listMovies } from './schema/list-movies.schema';
import { lists } from './schema/lists.schema';
import { movies } from './schema/movies.schema';

export type DrizzleDatabase = ReturnType<typeof initDrizzleDatabase>;

export const initDrizzleDatabase = (binding: {}) => {
  return drizzle(binding, {
    schema: {
      listMovies,
      lists,
      movies,
    },
  });
};
