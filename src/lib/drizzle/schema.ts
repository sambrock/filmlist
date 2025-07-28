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

import { MovieDetails } from '../tmdb';

export const users = pgTable('users', {
  userId: uuid('user_id').primaryKey(),
  anon: boolean('anon').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
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
  parsed: jsonb('parsed').$type<{ tmdbId: number; title: string; releaseYear: string; why: string }[]>(),
  model: text('model').notNull(),
  role: text({ enum: ['user', 'assistant'] }).notNull(),
  status: text({ enum: ['pending', 'done'] }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const movies = pgTable('movies', {
  movieId: uuid('movie_id').primaryKey(),
  tmdbId: integer('tmdb_id').unique(),
  source: jsonb('source_tmdb').$type<MovieDetails>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const library = pgTable(
  'library',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.userId),
    movieId: uuid('movie_id')
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

export const messageMovies = pgTable(
  'message_movies',
  {
    messageId: uuid('message_id')
      .notNull()
      .references(() => messages.messageId),
    movieId: uuid('movie_id')
      .notNull()
      .references(() => movies.movieId),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    primaryKey({
      columns: [t.messageId, t.movieId],
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
  movies: many(messageMovies),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  libraries: many(library),
  messages: many(messageMovies),
}));

export const libraryRelations = relations(library, ({ one }) => ({
  user: one(users, {
    fields: [library.userId],
    references: [users.userId],
  }),
  movie: one(movies, {
    fields: [library.movieId],
    references: [movies.movieId],
  }),
}));

export const messageMoviesRelations = relations(messageMovies, ({ one }) => ({
  message: one(messages, {
    fields: [messageMovies.messageId],
    references: [messages.messageId],
  }),
  movie: one(movies, {
    fields: [messageMovies.movieId],
    references: [movies.movieId],
  }),
}));
