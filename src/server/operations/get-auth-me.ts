import { cookies } from 'next/headers';

import { generateAuthToken, verifyAuthToken } from '@/lib/auth';
import { uuid } from '@/lib/utils';
import { publicProcedure } from '../trpc';

export const getAuthMe = publicProcedure.query(async ({ ctx }) => {
  if (ctx.token) {
    const verified = verifyAuthToken(ctx.token);

    if (verified) {
      return verified;
    }
  }

  const anonymousUser = {
    userId: `draft:${uuid()}`,
    anon: true,
    persisted: false,
  };

  const cookieStore = await cookies();
  cookieStore.set('auth-token', generateAuthToken(anonymousUser), {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'strict',
  });

  return anonymousUser;
});
