import { z } from 'zod';

import { db } from '@/lib/drizzle';
import { publicProcedure } from '../trpc';

export const getUserThreads = publicProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { userId } = input;

    const threads = await db.query.threads.findMany({
      where: (threads, { eq }) => eq(threads.userId, userId),
    });

    return threads;
  });
