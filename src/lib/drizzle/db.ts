import { drizzle } from 'drizzle-orm/node-postgres';

import { env } from '../env';
import {
  library,
  libraryRelations,
  messageRelations,
  messages,
  movies,
  moviesRelations,
  recommendations,
  recommendationsRelations,
  threads,
  threadsRelations,
  userRelations,
  users,
} from './schema';

export const db = drizzle(env.DATABASE_URL, {
  schema: {
    library,
    libraryRelations,
    recommendations,
    recommendationsRelations,
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
