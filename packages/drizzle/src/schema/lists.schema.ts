import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { generateNanoid } from '@filmlist/lib/utils';
import { listMovies } from './list-movies.schema';

export type List = typeof lists.$inferSelect;
export type ListInsert = typeof lists.$inferInsert;

export const lists = sqliteTable('lists', {
  listId: integer().primaryKey(),
  readId: text({ length: 12 })
    .unique()
    .notNull()
    .$defaultFn(() => generateNanoid(12)),
  editId: text({ length: 22 })
    .unique()
    .notNull()
    .$defaultFn(() => generateNanoid(22)),
  title: text().notNull(),
  description: text().notNull().default(''),
  locked: integer({ mode: 'boolean' }).notNull().default(false),
  owner: text().notNull(),
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date())
    .$defaultFn(() => new Date()),
  lastUpdate: integer({ mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date())
    .$defaultFn(() => new Date()),
});

export const listRelations = relations(lists, ({ many }) => ({
  listMovies: many(listMovies),
}));
