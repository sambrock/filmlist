import 'server-only';

import * as jwt from 'jsonwebtoken';

import { env } from './env';

export type User = {
  userId: string;
  anon: boolean;
  indexThreadId?: string;
};

export const generateAuthToken = (user: User) => {
  return jwt.sign(user, env.JWT_SECRET);
};

export const verifyAuthToken = (token: string): User | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as User;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};
