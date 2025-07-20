import { z } from 'zod';

import { db, MessageWithRecommendationsSchema } from '@/lib/drizzle';
import { publicProcedure } from '../trpc';

export const getMessagesProcedures = publicProcedure
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
      messages: MessageWithRecommendationsSchema.array(),
    })
  )
  .query(async ({ input }) => {
    const { threadId, limit, cursor } = input;

    const messagesWithRecommendations = await db.query.messages.findMany({
      where: (messages, { and, eq, lt }) =>
        and(eq(messages.threadId, threadId), cursor ? lt(messages.serial, cursor) : undefined),
      orderBy: (messages, { desc }) => [desc(messages.serial)],
      with: {
        recommendations: {
          with: { movie: true },
        },
      },
      limit,
    });

    const nextCursor =
      messagesWithRecommendations.length > 0
        ? messagesWithRecommendations[messagesWithRecommendations.length - 1].serial
        : 0;

    return {
      nextCursor,
      messages: messagesWithRecommendations,
    };
  });
