import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { lists } from './lists.schema';
import { movies } from './movies.schema';

export const listMovies = sqliteTable('list_movies', {
  listId: integer().references(() => lists.id),
  movieId: integer().references(() => movies.id),
  order: integer().notNull(),
  createdAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const listMoviesRelations = relations(listMovies, ({ one }) => ({
  list: one(lists, { fields: [listMovies.listId], references: [lists.id] }),
  movie: one(movies, { fields: [listMovies.movieId], references: [movies.id] }),
}));
