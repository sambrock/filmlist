import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import {
  SCHEMA_CLIENT_ID_LENGTH,
  SCHEMA_LIST_DESCRIPTION_MAX_LENGTH,
  SCHEMA_LIST_EDIT_ID_LENGTH,
  SCHEMA_LIST_READ_ID_LENGTH,
  SCHEMA_LIST_TITLE_MAX_LENGTH,
} from '@repo/lib/constants';
import { listMovies } from './list-movies.schema';

export const lists = sqliteTable('lists', {
  listId: integer().primaryKey(),
  editId: text({ length: SCHEMA_LIST_EDIT_ID_LENGTH }).unique().notNull(),
  readId: text({ length: SCHEMA_LIST_READ_ID_LENGTH }).unique().notNull(),
  clientId: text({ length: SCHEMA_CLIENT_ID_LENGTH }).notNull(),
  title: text({ length: SCHEMA_LIST_TITLE_MAX_LENGTH }).notNull(),
  description: text({ length: SCHEMA_LIST_DESCRIPTION_MAX_LENGTH }).notNull().default(''),
  locked: integer({ mode: 'boolean' }).notNull().default(false),
  lastUpdate: integer({ mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date())
    .$defaultFn(() => new Date()),
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date())
    .$defaultFn(() => new Date()),
});

export const listRelations = relations(lists, ({ many }) => ({
  listMovies: many(listMovies),
}));

export type List = typeof lists.$inferSelect;
export type ListInsert = typeof lists.$inferInsert;

export const ListSchema = createSelectSchema(lists);
export const ListInsertSchema = createInsertSchema(lists);
