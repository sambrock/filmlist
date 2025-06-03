import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getThreadMessages = query({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_thread', (q) => q.eq('thread', args.threadId))
      .collect();

    return messages;
  },
});

export const createThread = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('threads', {
      title: args.title,
    });

    return id;
  },
});
