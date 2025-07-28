import { db } from '@/lib/drizzle';
import { protectedProcedure } from '../trpc';

export const getUserThreads = protectedProcedure.query(async ({ ctx }) => {
  const { userId } = ctx.user;

  const threads = await db.query.threads.findMany({
    where: (threads, { eq }) => eq(threads.userId, userId),
  });

  return threads;
});
