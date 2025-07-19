import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { publicProcedure } from '../trpc';

export const getMessagesProcedures = publicProcedure
  .input(
    z.object({
      threadId: z.string(),
      limit: z.number().optional().default(20),
      cursor: z.number().optional(),
    })
  )
  .query(async ({ input }) => {
    const { threadId, limit, cursor } = input;

    const messagesWithMovies = await db.query.messages.findMany({
      where: (messages, { and, eq, lt }) =>
        and(eq(messages.threadId, threadId), cursor ? lt(messages.serial, cursor) : undefined),
      orderBy: (messages, { desc }) => [desc(messages.serial)],
      with: {
        recommendations: {
          with: {
            movie: true,
          },
        },
      },
      limit,
    });

    const nextCursor =
      messagesWithMovies.length > 0 ? messagesWithMovies[messagesWithMovies.length - 1].serial : 0;

    return {
      nextCursor,
      messages: messagesWithMovies.map((messageWithMovies) => {
        const { recommendations, ...message } = messageWithMovies;
        return { message, recommendations };
      }),
    };
  });
