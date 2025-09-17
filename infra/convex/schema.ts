import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const userSchema = {
  userId: v.string(),
  anon: v.boolean(),
};

export const threadSchema = {
  threadId: v.string(),
  userId: v.string(),
  title: v.string(),
};

const movieFoundSchema = {
  found: v.literal(true),
  tmdbId: v.number(),
  title: v.string(),
  why: v.string(),
  releaseDate: v.number(),
  runtime: v.number(),
  genres: v.array(v.string()),
  overview: v.string(),
  backdropPath: v.string(),
  posterPath: v.string(),
};

const movieNotFoundSchema = {
  found: v.literal(false),
  title: v.string(),
  why: v.string(),
  releaseDate: v.number(),
};

export const messageSchema = {
  messageId: v.string(),
  threadId: v.string(),
  parentId: v.optional(v.string()),
  content: v.string(),
  model: v.string(),
  role: v.union(v.literal('user'), v.literal('assistant')),
  status: v.union(v.literal('pending'), v.literal('done')),
  movies: v.optional(v.array(v.union(v.object(movieFoundSchema), v.object(movieNotFoundSchema)))),
};

export const watchlistSchema = {
  userId: v.string(),
  tmdbId: v.number(),
};

export default defineSchema({
  users: defineTable(userSchema).index('by_user_id', ['userId']),
  threads: defineTable(threadSchema).index('by_thread_id', ['threadId']).index('by_user_id', ['userId']),
  messages: defineTable(messageSchema)
    .index('by_message_id', ['messageId'])
    .index('by_thread_id', ['threadId']),
  watchlist: defineTable(watchlistSchema)
    .index('by_user_id', ['userId'])
    .index('by_tmdb_id', ['tmdbId'])
    .index('by_user_tmdb_id', ['userId', 'tmdbId']),
});
