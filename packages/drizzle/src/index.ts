import { drizzle } from 'drizzle-orm/d1';

import { likes } from './schema/likes.schema';
import { movies } from './schema/movies.schema';
import { ratings } from './schema/ratings.schema';
import { users } from './schema/users.schema';
import { watched } from './schema/watched.schema';
import { watchlist } from './schema/watchlist.schema';

export type Database = ReturnType<typeof initDatabase>;

export const initDatabase = (binding: {}) => {
  return drizzle(binding, {
    schema: {
      likes,
      movies,
      ratings,
      users,
      watched,
      watchlist,
    },
  });
};

export { users, movies, likes, ratings, watched, watchlist };
