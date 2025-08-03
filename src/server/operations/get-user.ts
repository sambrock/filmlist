import { cookies } from 'next/headers';
import { TRPCError } from '@trpc/server';
import z from 'zod';

import { generateAuthToken } from '@/lib/auth';
import { db, users } from '@/lib/drizzle';
import { uuid } from '@/lib/utils';
import { publicProcedure } from '../trpc';

export const getUser = publicProcedure
  .output(
    z.object({
      userId: z.string(),
      anon: z.boolean(),
    })
  )
  .query(async ({ ctx }) => {
    if (ctx.user) {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.userId, ctx.user!.userId),
        columns: { userId: true, anon: true },
      });

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return { userId: user.userId, anon: user.anon };
    }

    // Create anonymous user
    const [user] = await db.insert(users).values({ userId: uuid(), anon: true }).returning();

    const c = await cookies();
    c.set('auth-token', generateAuthToken(user), {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'strict',
    });

    return { userId: user.userId, anon: user.anon };
  });
