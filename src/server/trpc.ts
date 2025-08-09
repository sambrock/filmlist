import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { initTRPC, TRPCError } from '@trpc/server';

import { verifyAuthToken } from '@/lib/auth';

const t = initTRPC.context<typeof createContext>().create({});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

// Context

export const createContext = cache(async () => {
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get('auth-token');

  if (authTokenCookie) {
    const verified = verifyAuthToken(authTokenCookie.value);
    return { auth: Boolean(verified), user: verified, token: authTokenCookie.value };
  }

  return { auth: false, user: null, token: null };
});

// Middleware

export const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (ctx.auth) {
    return next();
  }

  throw new TRPCError({ code: 'UNAUTHORIZED' });
});

// Procedures

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
