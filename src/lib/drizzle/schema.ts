import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  pk: serial('pk').unique().primaryKey(),
  userId: uuid('userId').notNull().unique(),
  anon: boolean('anon').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const threads = pgTable('threads', {
  pk: serial('pk').unique().primaryKey(),
  userFk: integer('user_fk')
    .notNull()
    .unique()
    .references(() => users.pk),
  threadId: uuid('thread_id').notNull().unique(),
  model: text('model').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const messages = pgTable('messages', {
  pk: serial('pk').unique().primaryKey(),
  parentFk: integer('parent_fk'),
  threadFk: integer('thread_fk')
    .notNull()
    .unique()
    .references(() => threads.pk),
  messageId: uuid('message_id').notNull().unique(),
  content: text('content').notNull(),
  model: text('model').notNull(),
  role: text({ enum: ['user', 'assistant'] }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const movies = pgTable('movies', {
  pk: serial('pk').unique().primaryKey(),
  tmdbId: integer('tmdb_id').notNull().unique(),
  title: text('title').notNull(),
  releaseDate: date('release_date', { mode: 'date' }).notNull(),
  posterPath: text('poster_path').notNull(),
  backdropPath: text('backdrop_path').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const library = pgTable(
  'library',
  {
    userFk: integer('user_fk')
      .notNull()
      .unique()
      .references(() => users.pk),
    movieFk: integer('movie_fk')
      .notNull()
      .unique()
      .references(() => movies.pk),
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
      columns: [t.userFk, t.movieFk],
    }),
  ]
);

export const messagesToMovies = pgTable(
  'messages_to_movies',
  {
    messageFk: integer('message_fk')
      .notNull()
      .unique()
      .references(() => messages.pk),
    movieFk: integer('movie_fk')
      .notNull()
      .unique()
      .references(() => movies.pk),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    primaryKey({
      columns: [t.messageFk, t.movieFk],
    }),
  ]
);

export const userRelations = relations(users, ({ many, one }) => ({
  threads: many(threads),
  library: one(library, {
    fields: [users.pk],
    references: [library.userFk],
  }),
}));

export const threadsRelations = relations(threads, ({ one, many }) => ({
  user: one(users, {
    fields: [threads.userFk],
    references: [users.pk],
  }),
  messages: many(messages),
}));

export const messageRelations = relations(messages, ({ one, many }) => ({
  thread: one(threads, {
    fields: [messages.threadFk],
    references: [threads.pk],
  }),
  parent: one(messages, {
    fields: [messages.parentFk],
    references: [messages.pk],
  }),
  movies: many(messagesToMovies),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  libraries: many(library),
  messages: many(messagesToMovies),
}));

export const messagesToMoviesRelations = relations(messagesToMovies, ({ one }) => ({
  message: one(messages, {
    fields: [messagesToMovies.messageFk],
    references: [messages.pk],
  }),
  movie: one(movies, {
    fields: [messagesToMovies.movieFk],
    references: [movies.pk],
  }),
}));

export const libraryRelations = relations(library, ({ one }) => ({
  users: one(users, {
    fields: [library.userFk],
    references: [users.pk],
  }),
  movies: one(movies, {
    fields: [library.movieFk],
    references: [movies.pk],
  }),
}));
