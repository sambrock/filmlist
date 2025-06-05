import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { threads } from '@/lib/drizzle/schema';
import { baseProcedure, createTRPCRouter } from '../init';

export const threadsRouter = createTRPCRouter({
  initThread: baseProcedure
    .input(
      z.object({
        userId: z.string(),
        threadId: z.string(),
      })
    )
    .mutation(async (opts) => {
      return db.insert(threads).values({
        threadId: opts.input.threadId,
        ownerId: opts.input.userId,
      });
    }),

  getUserThreads: baseProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async (opts) => {
      return db.query.threads.findMany({
        where: (thread, { eq }) => eq(thread.ownerId, opts.input.userId),
      });
    }),
});
