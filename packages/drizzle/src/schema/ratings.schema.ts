import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

import { movies } from './movies.schema';
import { users } from './users.schema';

export const ratings = sqliteTable(
  'ratings',
  {
    id: integer().primaryKey(),
    userId: integer().notNull(),
    movieId: integer().notNull(),
    rating: integer().notNull(),
    createdAt: text()
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => [unique().on(t.userId, t.movieId)]
);

export const ratingsRelations = relations(ratings, ({ one }) => ({
  user: one(users, { fields: [ratings.userId], references: [users.id] }),
  movie: one(movies, { fields: [ratings.movieId], references: [movies.id] }),
}));
