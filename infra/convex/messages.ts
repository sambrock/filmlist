import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { messageSchema } from './schema';

export const getByThreadId = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query('messages')
      .withIndex('by_thread_id', (q) => q.eq('threadId', args.threadId))
      .collect();
  },
});

export const create = mutation({
  args: {
    data: v.object(messageSchema),
  },
  handler: async (ctx, args) => {
    const _id = await ctx.db.insert('messages', args.data);
    return ctx.db.get(_id);
  },
});

export const update = mutation({
  args: {
    messageId: v.string(),
    data: v.object({
      content: v.optional(messageSchema.content),
      movies: v.optional(messageSchema.movies),
      status: v.optional(messageSchema.status),
    }),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db
      .query('messages')
      .withIndex('by_message_id', (q) => q.eq('messageId', args.messageId))
      .first();
    if (!message) return;
    await ctx.db.patch(message._id, args.data);
    return ctx.db.get(message._id);
  },
});

// export const updateContent = mutation({
//   args: { messageId: v.id('messages'), content: v.string() },
//   handler: async (ctx, args) => {
//     const message = await ctx.db.get(args.messageId);
//     if (!message) {
//       throw new Error('Message not found');
//     }
//     await ctx.db.patch(args.messageId, {
//       content: (message.content += args.content),
//     });
//   },
// });
