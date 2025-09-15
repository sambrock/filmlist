import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { librarySchema } from './schema';

export const updateLibrary = mutation({
  args: {
    userId: v.string(),
    tmdbId: v.number(),
    data: v.object({
      watched: v.optional(librarySchema.watched),
      watchlist: v.optional(librarySchema.watchlist),
      liked: v.optional(librarySchema.liked),
    }),
  },
  handler: async (ctx, args) => {
    const exists = await ctx.db
      .query('library')
      .withIndex('by_user_tmdb_id', (q) => q.eq('userId', args.userId).eq('tmdbId', args.tmdbId))
      .first();

    if (exists) {
      await ctx.db.patch(exists._id, {
        ...args.data,
      });
    } else {
      await ctx.db.insert('library', {
        userId: args.userId,
        tmdbId: args.tmdbId,
        ...args.data,
      });
    }
  },
});
