import { relations } from 'drizzle-orm';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
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
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const listMoviesRelations = relations(listMovies, ({ one }) => ({
  list: one(lists, { fields: [listMovies.listId], references: [lists.listId] }),
  movie: one(movies, { fields: [listMovies.movieId], references: [movies.movieId] }),
}));

export type ListMovie = typeof listMovies.$inferSelect;
export type ListMovieInsert = typeof listMovies.$inferInsert;

export const listMovieSelectSchema = createSelectSchema(listMovies);
export const listMovieInsertSchema = createInsertSchema(listMovies).omit({ createdAt: true }).required();
export const listMovieDeleteSchema = listMovieInsertSchema.omit({ order: true }).required();
