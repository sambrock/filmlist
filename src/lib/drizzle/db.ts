import { drizzle } from 'drizzle-orm/node-postgres';

import { env } from '../utils/env';
import {
  messages,
  messagesMovies,
  movies,
  moviesRelations,
  threads,
  threadsRelations,
  users,
  usersMovies,
} from './schema';

export const db = drizzle(env.DATABASE_URL, {
  schema: {
    users,
    threads,
    messages,
    movies,
    usersMovies,
    threadsRelations,
    messagesMovies,
    moviesRelations,
  },
});
