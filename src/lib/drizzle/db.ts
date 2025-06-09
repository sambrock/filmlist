import { drizzle } from 'drizzle-orm/node-postgres';

import { env } from '../utils/env';
import {
  messageMoviesRelations,
  messageRelations,
  messages,
  messagesMovies,
  movies,
  moviesRelations,
  threads,
  threadsRelations,
  userMoviesRelations,
  userRelations,
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
    messageMoviesRelations,
    userMoviesRelations,
    messageRelations,
    userRelations,
  },
});
