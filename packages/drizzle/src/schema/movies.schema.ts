import { relations } from 'drizzle-orm';
import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

import { listMovies } from './list-movies.schema';

export type Movie = typeof movies.$inferSelect;

export const movies = sqliteTable('movies', {
  movieId: integer().primaryKey(),
  tmdbId: integer().notNull().unique(),
  title: text().notNull(),
  posterPath: text().notNull(),
  releaseDate: text().notNull(),
  slug: text().notNull().unique(),
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const moviesRelations = relations(movies, ({ many }) => ({
  listMovies: many(listMovies),
}));
