import { drizzle } from 'drizzle-orm/node-postgres';

import { env } from '../env';
import {
  library,
  libraryRelations,
  messageMovies,
  messageMoviesRelations,
  messageRelations,
  messages,
  movies,
  moviesRelations,
  threads,
  threadsRelations,
  userRelations,
  users,
} from './schema';

export const db = drizzle(env.DATABASE_URL, {
  schema: {
    library,
    libraryRelations,
    messageMovies,
    messageMoviesRelations,
    messageRelations,
    messages,
    movies,
    moviesRelations,
    threads,
    threadsRelations,
    userRelations,
    users,
  },
});
