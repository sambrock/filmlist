import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { messageSchema } from './schema';

export const newChatMessage = mutation({
  args: {
    userId: v.string(),
    threadId: v.string(),
    threadIsPersisted: v.boolean(),
    userMessage: v.object(messageSchema),
    assistantMessage: v.object(messageSchema),
  },
  handler: async (ctx, args) => {
    if (!args.threadIsPersisted) {
      await ctx.db.insert('threads', {
        threadId: args.threadId,
        userId: args.userId,
        title: '',
      });
    }

    await ctx.db.insert('messages', args.userMessage);
    await ctx.db.insert('messages', args.assistantMessage);
  },
});
