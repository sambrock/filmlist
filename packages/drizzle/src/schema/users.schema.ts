import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { likes } from './likes.schema';
import { ratings } from './ratings.schema';
import { watched } from './watched.schema';

export const users = sqliteTable('users', {
  id: integer().primaryKey(),
  email: text().notNull().unique(),
  username: text().notNull(),
  password: text().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  likes: many(likes),
  ratings: many(ratings),
  watched: many(watched),
}));
