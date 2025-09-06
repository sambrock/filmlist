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

import { MovieDetails } from '../tmdb/types';
import { ModelResponseStructured } from './types';

export const users = pgTable('users', {
  userId: uuid('user_id').primaryKey(),
  anon: boolean('anon').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const chats = pgTable('chats', {
  chatId: uuid('chat_id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId),
  title: text('title').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const messages = pgTable('messages', {
  messageId: uuid('message_id').primaryKey(),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => chats.chatId),
  parentId: uuid('parent_id'),
  serial: serial('serial').notNull(),
  content: text('content').notNull(),
  structured: jsonb('structured').$type<ModelResponseStructured[]>(),
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
  movieId: integer('movie_id').primaryKey(), // same as tmdbId
  tmdbId: integer('tmdb_id').unique().notNull(),
  source: jsonb('source_tmdb').$type<MovieDetails>().notNull(),
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

export const messageMovies = pgTable(
  'message_movies',
  {
    messageId: uuid('message_id')
      .notNull()
      .references(() => messages.messageId),
    movieId: integer('movie_id')
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
  chats: many(chats),
  library: one(library, {
    fields: [users.userId],
    references: [library.userId],
  }),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.userId],
  }),
  messages: many(messages),
}));

export const messageRelations = relations(messages, ({ one, many }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.chatId],
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
