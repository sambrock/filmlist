import { cookies } from 'next/headers';

import { generateAuthToken } from '@/lib/auth';
import { db, users } from '@/lib/drizzle';
import { uuid } from '@/lib/utils';
import { publicProcedure } from '../trpc';

export const getUserInfo = publicProcedure.query(async ({ ctx }) => {
  const requestCookies = await cookies();

  if (ctx.user) {
    return ctx.user;
  }

  // If there is no user in the context, initialize an anonymous user
  const user = {
    userId: uuid(),
    anon: true,
  };

  await db.insert(users).values(user);

  const token = generateAuthToken(user);

  requestCookies.set('auth-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });

  return user;
});
