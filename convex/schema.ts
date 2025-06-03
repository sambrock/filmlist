import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // users: defineTable({
  //   name: v.string(),
  //   tokenIdentifier: v.string(),
  //   _createdAt: v.number(),
  //   _updatedAt: v.number(),
  // }).index('by_token', ['tokenIdentifier']),

  movies: defineTable({
    tmdbId: v.number(),
    title: v.string(),
    posterPath: v.string(),
    releaseYear: v.number(),
    // _createdAt: v.number(),
    // _updatedAt: v.number(),
  }),

  threads: defineTable({
    // user: v.id('users'),
    title: v.string(),
    // _createdAt: v.number(),
    // _updatedAt: v.number(),
  }),

  messages: defineTable({
    thread: v.id('threads'),
    content: v.string(),
    model: v.string(),
    role: v.string(),
    movies: v.array(v.id('movies')),
    // _createdAt: v.number(),
    // _updatedAt: v.number(),
  }).index('by_thread', ['thread']),

  // watchlists: defineTable({
  //   user: v.id('users'),
  //   _createdAt: v.number(),
  //   _updatedAt: v.number(),
  // }),

  // watchlistItems: defineTable({
  //   watchlist: v.id('watchlists'),
  //   movie: v.id('movies'),
  //   _createdAt: v.number(),
  // }),
});
