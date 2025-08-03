import { TRPCError } from '@trpc/server';
import z from 'zod';

import { db } from '@/lib/drizzle';
import { protectedProcedure } from '../trpc';

export const getUserThreads = protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
  if (input !== ctx.user.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  const threads = await db.query.threads.findMany({
    where: (threads, { eq }) => eq(threads.userId, input),
    orderBy: (threads, { desc }) => [desc(threads.createdAt)],
  });

  return threads;
});
