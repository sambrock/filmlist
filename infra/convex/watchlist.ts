import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getWatchlist = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query('watchlist')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

export const updateWatchlist = mutation({
  args: {
    userId: v.string(),
    tmdbId: v.number(),
    data: v.object({
      watchlist: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const exists = await ctx.db
      .query('watchlist')
      .withIndex('by_user_tmdb_id', (q) => q.eq('userId', args.userId).eq('tmdbId', args.tmdbId))
      .first();

    if (exists) {
      await ctx.db.delete(exists._id);
    } else {
      await ctx.db.insert('watchlist', { userId: args.userId, tmdbId: args.tmdbId });
    }
  },
});
