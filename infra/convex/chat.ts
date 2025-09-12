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
        userId: 'db4ff88c-23e4-4d72-a49b-c29e7e5f5d06',
        title: '',
      });
    }

    await ctx.db.insert('messages', args.userMessage);
    await ctx.db.insert('messages', args.assistantMessage);
  },
});
