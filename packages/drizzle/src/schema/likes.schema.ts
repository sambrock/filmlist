import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { movies } from './movies.schema';
import { users } from './users.schema';

export const likes = sqliteTable('likes', {
  id: integer().primaryKey(),
  userId: integer().notNull(),
  movieId: integer().notNull(),
  createdAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, { fields: [likes.userId], references: [users.id] }),
  movie: one(movies, { fields: [likes.movieId], references: [movies.id] }),
}));
