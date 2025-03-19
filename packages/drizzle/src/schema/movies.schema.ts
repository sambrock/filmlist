import { relations, sql } from 'drizzle-orm';
import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

import { likes } from './likes.schema';
import { ratings } from './ratings.schema';
import { watched } from './watched.schema';

export const movies = sqliteTable('movies', {
  id: integer().primaryKey(),
  tmdbId: integer().notNull().unique(),
  title: text().notNull(),
  backdropPath: text().notNull(),
  posterPath: text().notNull(),
  overview: text().notNull(),
  releaseDate: text()
    .notNull()
    .default(sql`(CURRENT_DATE)`),
  createdAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const moviesRelations = relations(movies, ({ many }) => ({
  likes: many(likes),
  ratings: many(ratings),
  watched: many(watched),
}));
