import { relations } from 'drizzle-orm';
import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';

import { listMovies } from './list-movies.schema';

export const movies = sqliteTable('movies', {
  movieId: integer().primaryKey(), // Same as tmdbId
  tmdbId: integer().unique().notNull(),
  title: text().notNull(),
  posterPath: text().notNull(),
  releaseDate: text().notNull(),
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const moviesRelations = relations(movies, ({ many }) => ({
  listMovies: many(listMovies),
}));

export type Movie = typeof movies.$inferSelect;
export type MovieInsert = typeof movies.$inferInsert;

export const MovieSchema = createSelectSchema(movies);
export const MovieInsertSchema = createInsertSchema(movies);
