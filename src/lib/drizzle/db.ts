import { drizzle } from 'drizzle-orm/node-postgres';

import { env } from '../env';
import {
  library,
  libraryRelations,
  messageRelations,
  messages,
  messagesToMovies,
  messagesToMoviesRelations,
  movies,
  moviesRelations,
  threads,
  threadsRelations,
  userRelations,
  users,
} from './schema';

export const db = drizzle(env.DATABASE_URL, {
  schema: {
    users,
    threads,
    messages,
    movies,
    library,
    libraryRelations,
    messageRelations,
    messagesToMovies,
    messagesToMoviesRelations,
    moviesRelations,
    threadsRelations,
    userRelations,
  },
});
