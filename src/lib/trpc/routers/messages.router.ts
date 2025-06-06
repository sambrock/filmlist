import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { baseProcedure, createTRPCRouter } from '../init';

export const messagesRouter = createTRPCRouter({
  getMessagesByThread: baseProcedure
    .input(
      z.object({
        threadId: z.string(),
      })
    )
    .query(async (opts) => {
      return db.query.messages.findMany({
        where: (message, { eq }) => eq(message.threadId, opts.input.threadId),
      });
    }),
});
