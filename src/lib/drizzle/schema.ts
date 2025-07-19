import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { TMDbMovieWithDirector } from '../tmdb';

export const users = pgTable('users', {
  userId: uuid('user_id').primaryKey(),
  anon: boolean('anon').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const threads = pgTable('threads', {
  threadId: uuid('thread_id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId),
  model: text('model').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const messages = pgTable('messages', {
  messageId: uuid('message_id').primaryKey(),
  threadId: uuid('thread_id')
    .notNull()
    .references(() => threads.threadId),
  parentId: uuid('parent_id'),
  serial: serial('serial').notNull(),
  content: text('content').notNull(),
  model: text('model').notNull(),
  role: text({ enum: ['user', 'assistant'] }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const recommendations = pgTable('recommendations', {
  recommendationId: uuid('recommendation_id').primaryKey(),
  messageId: uuid('message_id')
    .notNull()
    .references(() => messages.messageId),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.movieId),
  title: text('title').notNull(),
  releaseYear: text('release_year').notNull(),
  why: text('why').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const movies = pgTable('movies', {
  movieId: integer('movie_id').primaryKey(), // Same as TMDb ID
  source: jsonb('source_tmdb').$type<TMDbMovieWithDirector>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const library = pgTable(
  'library',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.userId),
    movieId: integer('movie_id')
      .notNull()
      .references(() => movies.movieId),
    watched: boolean('watched').default(false),
    liked: boolean('liked').default(false),
    watchlist: boolean('watchlist').default(false),
    ignore: boolean('ignore').default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    primaryKey({
      columns: [t.userId, t.movieId],
    }),
  ]
);

export const userRelations = relations(users, ({ many, one }) => ({
  threads: many(threads),
  library: one(library, {
    fields: [users.userId],
    references: [library.userId],
  }),
}));

export const threadsRelations = relations(threads, ({ one, many }) => ({
  user: one(users, {
    fields: [threads.userId],
    references: [users.userId],
  }),
  messages: many(messages),
}));

export const messageRelations = relations(messages, ({ one, many }) => ({
  thread: one(threads, {
    fields: [messages.threadId],
    references: [threads.threadId],
  }),
  parent: one(messages, {
    fields: [messages.parentId],
    references: [messages.messageId],
  }),
  recommendations: many(recommendations),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  libraries: many(library),
  recommendations: many(recommendations),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  message: one(messages, {
    fields: [recommendations.messageId],
    references: [messages.messageId],
  }),
  movie: one(movies, {
    fields: [recommendations.movieId],
    references: [movies.movieId],
  }),
}));

export const libraryRelations = relations(library, ({ one }) => ({
  users: one(users, {
    fields: [library.userId],
    references: [users.userId],
  }),
  movies: one(movies, {
    fields: [library.movieId],
    references: [movies.movieId],
  }),
}));
