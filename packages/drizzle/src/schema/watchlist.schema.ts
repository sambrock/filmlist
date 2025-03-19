import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { movies } from './movies.schema';
import { users } from './users.schema';

export const watchlist = sqliteTable('watchlist', {
  id: integer().primaryKey(),
  userId: integer().notNull(),
  movieId: integer().notNull(),
  createdAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(users, { fields: [watchlist.userId], references: [users.id] }),
  movie: one(movies, { fields: [watchlist.movieId], references: [movies.id] }),
}));
