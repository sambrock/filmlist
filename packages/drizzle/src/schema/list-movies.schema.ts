import { relations } from 'drizzle-orm';
import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { lists } from './lists.schema';
import { movies } from './movies.schema';

export const listMovies = sqliteTable('list_movies', {
  listId: integer()
    .notNull()
    .references(() => lists.listId),
  movieId: integer()
    .notNull()
    .references(() => movies.movieId),
  order: integer().notNull(),
  userPosterPath: text(),
  createdAt: integer({ mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const listMoviesRelations = relations(listMovies, ({ one }) => ({
  list: one(lists, { fields: [listMovies.listId], references: [lists.listId] }),
  movie: one(movies, { fields: [listMovies.movieId], references: [movies.movieId] }),
}));

export type ListMovie = typeof listMovies.$inferSelect;
export type ListMovieInsert = typeof listMovies.$inferInsert;

export const ListMovieSchema = createSelectSchema(listMovies);
export const ListMovieInsertSchema = createInsertSchema(listMovies)
