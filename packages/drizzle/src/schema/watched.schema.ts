import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { movies } from './movies.schema';
import { users } from './users.schema';

export const watched = sqliteTable('watched', {
  id: integer().primaryKey(),
  userId: integer().notNull(),
  movieId: integer().notNull(),
  createdAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const watchedRelations = relations(watched, ({ one }) => ({
  user: one(users, { fields: [watched.userId], references: [users.id] }),
  movie: one(movies, { fields: [watched.movieId], references: [movies.id] }),
}));
