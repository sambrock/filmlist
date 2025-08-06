import 'server-only';

import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

import { env } from './env';

export type User = {
  userId: string;
  anon: boolean;
  persisted: boolean;
};

export const generateAuthToken = (user: User) => {
  return jwt.sign(user, env.JWT_SECRET);
};

export const verifyAuthToken = (token: string): User | null => {
  const user = jwt.verify(token, env.JWT_SECRET);
  if (!user || typeof user !== 'object' || !('userId' in user)) {
    return null;
  }
  return user as User;
};

export const readAuthTokenCookie = async () => {
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get('auth-token');
  if (!authTokenCookie) {
    return null;
  }
  const user = verifyAuthToken(authTokenCookie.value);
  return user;
};

export const setAuthTokenCookie = async (user: User) => {
  const cookieStore = await cookies();
  const token = generateAuthToken(user);
  cookieStore.set('auth-token', token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
};
