import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { listMovies } from './list-movies.schema';

export const lists = sqliteTable('lists', {
  id: integer().primaryKey(),
  publicId: text({ length: 12 }).unique(),
  title: text(),
  createdAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const listRelations = relations(lists, ({ many }) => ({
  listMovies: many(listMovies),
}));
