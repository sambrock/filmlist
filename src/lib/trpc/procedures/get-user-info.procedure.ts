import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { baseProcedure } from '../init';

export const getUserInfoProcedure = baseProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  .query(async (opts) => {
    const { userId } = opts.input;

    console.log('LOAD USER INFO', userId);

    const info = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.userId, userId),
    });

    const threads = await db.query.threads.findMany({
      where: (threads, { eq }) => eq(threads.ownerId, userId),
      orderBy: (threads, { desc }) => desc(threads.createdAt),
      limit: 10,
    });

    return { info, threads };
  });
