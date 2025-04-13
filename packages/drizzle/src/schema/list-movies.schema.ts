import { relations } from 'drizzle-orm';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';

import { lists } from './lists.schema';
import { movies } from './movies.schema';

export type ListMovie = typeof listMovies.$inferSelect;

export const listMovies = sqliteTable('list_movies', {
  listId: integer()
    .notNull()
    .references(() => lists.listId),
  movieId: integer()
    .notNull()
    .references(() => movies.movieId),
  order: integer().notNull(),
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const listMoviesRelations = relations(listMovies, ({ one }) => ({
  list: one(lists, { fields: [listMovies.listId], references: [lists.listId] }),
  movie: one(movies, { fields: [listMovies.movieId], references: [movies.movieId] }),
}));
