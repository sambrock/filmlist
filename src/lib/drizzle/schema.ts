import { relations } from 'drizzle-orm';
import { boolean, date, integer, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const users = pgTable('users', {
  userId: uuid('userId').primaryKey(),
  anon: boolean('anon').default(true),
  createdAt: date('createdAt').defaultNow(),
  updatedAt: date('updatedAt').notNull().defaultNow(),
});

export const threads = pgTable('threads', {
  threadId: uuid('threadId').primaryKey(),
  ownerId: uuid('ownerId').references(() => users.userId),
  title: text('title').notNull().default(''),
  createdAt: date('createdAt').notNull().defaultNow(),
  updatedAt: date('updatedAt').notNull().notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  messageId: uuid('messageId').primaryKey(),
  threadId: uuid('threadId').references(() => threads.threadId),
  content: text('content').notNull(),
  model: text('model').notNull(),
  role: text({ enum: ['user', 'assistant'] }).notNull(),
  createdAt: date('createdAt').notNull().defaultNow(),
  updatedAt: date('updatedAt').notNull().defaultNow(),
});

export const movies = pgTable('movies', {
  movieId: uuid('movieId').primaryKey(),
  tmdbId: integer('tmdbId').notNull().unique(),
  title: text('title').notNull(),
  releaseDate: date('releaseDate'),
  posterPath: text('posterPath'),
  backdropPath: text('backdropPath'),
  createdAt: date('createdAt').notNull().defaultNow(),
});

export const usersMovies = pgTable(
  'users_movies',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.userId),
    movieId: uuid('movieId')
      .notNull()
      .references(() => movies.movieId),
    watched: boolean('watched').default(false),
    watchlist: boolean('watchlist').default(false),
    ignore: boolean('ignore').default(false),
    createdAt: date('createdAt').notNull().defaultNow(),
    updatedAt: date('updatedAt').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.movieId] })]
);

export const messagesMovies = pgTable(
  'messages_movies',
  {
    messageId: uuid('messageId')
      .notNull()
      .references(() => messages.messageId),
    movieId: uuid('movieId')
      .notNull()
      .references(() => movies.movieId),
    createdAt: date('createdAt').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.messageId, t.movieId] })]
);

export const usesRelations = relations(users, ({ many }) => ({
  threads: many(threads),
  userMovies: many(usersMovies),
}));

export const threadsRelations = relations(threads, ({ one, many }) => ({
  owner: one(users, {
    fields: [threads.ownerId],
    references: [users.userId],
  }),
  messages: many(messages),
}));

export const messageRelations = relations(messages, ({ one, many }) => ({
  thread: one(threads, {
    fields: [messages.threadId],
    references: [threads.threadId],
  }),
  messageMovies: many(messagesMovies),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  userMovies: many(usersMovies),
  messageMovies: many(messagesMovies),
}));

export const messageMoviesRelations = relations(messagesMovies, ({ one }) => ({
  message: one(messages, {
    fields: [messagesMovies.messageId],
    references: [messages.messageId],
  }),
  movie: one(movies, {
    fields: [messagesMovies.movieId],
    references: [movies.movieId],
  }),
}));

export const userMoviesRelations = relations(usersMovies, ({ one }) => ({
  user: one(users, {
    fields: [usersMovies.userId],
    references: [users.userId],
  }),
  movie: one(movies, {
    fields: [usersMovies.movieId],
    references: [movies.movieId],
  }),
}));

export const insertUserSchema = createInsertSchema(users);
export const insertThreadSchema = createInsertSchema(threads);
export const insertMessageSchema = createInsertSchema(messages);
export const insertMovieSchema = createInsertSchema(movies);
