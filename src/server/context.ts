import { cookies } from 'next/headers';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { verifyAuthToken } from '@/lib/auth';

export type Context = Awaited<ReturnType<typeof createContext>>;

export async function createContext(opts: FetchCreateContextFnOptions) {
  async function getUserFromHeader() {
    const c = await cookies();
    const accessTokenCookie = c.get('auth-token');

    if (accessTokenCookie && accessTokenCookie.value) {
      const user = verifyAuthToken(accessTokenCookie.value);
      return user;
    }
    return null;
  }

  const user = await getUserFromHeader();

  return {
    user,
  };
}
