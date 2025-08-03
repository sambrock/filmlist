import 'server-only';

import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

import { env } from './env';

export type User = {
  userId: string;
  anon: boolean;
};

export const generateAuthToken = (user: User) => {
  return jwt.sign(user, env.JWT_SECRET);
};

export const verifyAuthToken = (token: string): User => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as User;
  } catch (err) {
    console.error(err);
    throw new Error('Invalid auth token');
  }
};

export const decodeAuthToken = (token: string): User => {
  return jwt.decode(token) as User;
};

export const getCurrentUser = async () => {
  const c = await cookies();
  const authTokenCookie = c.get('auth-token');

  return authTokenCookie ? decodeAuthToken(authTokenCookie.value) : undefined;
};
