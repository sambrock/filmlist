import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { threads } from '@/lib/drizzle/schema';
import { baseProcedure } from '../init';

export const initThreadProcedure = baseProcedure
  .input(
    z.object({
      threadId: z.string(),
    })
  )
  .mutation(async (opts) => {
    const { threadId } = opts.input;

    await db.insert(threads).values({
      threadId,
      ownerId: '37d387ec-32fd-45f7-af31-0df25936b241',
    });

    return {};
  });
