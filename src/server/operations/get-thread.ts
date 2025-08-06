import z from 'zod';

import { db } from '@/drizzle';
import { publicProcedure } from '../trpc';

export const getThread = publicProcedure
  .input(z.object({ threadId: z.string() }))
  .query(async ({ input }) => {
    const thread = await db.query.threads.findFirst({
      where: (threads, { eq }) => eq(threads.threadId, input.threadId),
    });

    return thread;
  });
