import { z } from 'zod';

import { db, MessageAssistantSchema, MessageSchema, MessageUserSchema } from '@/lib/drizzle';
import { protectedProcedure } from '../trpc';

export const getThreadMessages = protectedProcedure
  .input(
    z.object({
      threadId: z.string(),
      limit: z.number().optional().default(20),
      cursor: z.number().optional(),
    })
  )
  .output(
    z.object({
      nextCursor: z.number(),
      messages: z.union([MessageSchema, MessageUserSchema, MessageAssistantSchema]).array(),
    })
  )
  .query(async ({ input }) => {
    const { threadId, limit, cursor } = input;

    const messages = await db.query.messages.findMany({
      where: (messages, { and, eq, lt }) =>
        and(eq(messages.threadId, threadId), cursor ? lt(messages.serial, cursor) : undefined),
      orderBy: (messages, { desc }) => [desc(messages.serial)],
      with: { movies: true },
      limit,
    });

    const nextCursor = messages.length > 0 ? messages[messages.length - 1].serial : 0;

    return {
      nextCursor,
      messages,
    };
  });
