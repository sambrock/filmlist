import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const createUserMessage = mutation({
  args: {
    threadId: v.id('threads'), // Assuming threadId is passed in args
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('messages', {
      thread: args.threadId,
      content: args.content,
      role: 'user',
      model: 'llama-3.3-8b',
      movies: [],
    });
  },
});

export const createAssistantMessage = mutation({
  args: {
    threadId: v.id('threads'), // Assuming threadId is passed in args
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('messages', {
      thread: args.threadId,
      content: args.content,
      role: 'assistant',
      model: 'llama-3.3-8b',
      movies: [],
    });
  },
});

export const getThreadMessages = query({
  args: {
    threadId: v.id('threads'), // Assuming threadId is passed in args
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query('messages')
      .withIndex('by_thread', (q) => q.eq('thread', args.threadId))
      .collect();
  },
});
