import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { initTRPC, TRPCError } from '@trpc/server';

import { verifyAuthToken } from '@/lib/auth';

const t = initTRPC.context<typeof createTRPCContext>().create({});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

// Context

export const createTRPCContext = cache(async () => {
  const c = await cookies();
  const authTokenCookie = c.get('auth-token');

  if (authTokenCookie) {
    return { token: authTokenCookie.value };
  }

  return { token: null };
});

// Middleware

export const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (ctx.token) {
    const verified = verifyAuthToken(ctx.token);
    if (verified) {
      return next({ ctx: { user: verified } });
    }
  }

  throw new TRPCError({ code: 'UNAUTHORIZED' });
});

// Procedures

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
