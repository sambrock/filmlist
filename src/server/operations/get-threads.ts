import z from 'zod';

import { db } from '@/drizzle';
import { protectedProcedure } from '../trpc';

export const getThreads = protectedProcedure
  .input(
    z.object({
      userId: z.string().transform((val) => val.replace('draft:', '')),
    })
  )
  .query(async ({ input }) => {
    const threads = await db.query.threads.findMany({
      where: (threads, { eq }) => eq(threads.userId, input.userId),
      orderBy: (threads, { desc }) => [desc(threads.createdAt)],
    });

    return threads;
  });
