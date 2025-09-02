import 'server-only';

import { cache } from 'react';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { getAuthTokenCookie, verifyAuthToken } from '@/lib/auth';

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

export const createContext = cache(async () => {
  const authToken = await getAuthTokenCookie();
  if (authToken) {
    const user = verifyAuthToken(authToken);
    return { user };
  }

  return { user: null };
});

export const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (ctx.user) {
    return next();
  }

  throw new TRPCError({ code: 'UNAUTHORIZED' });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
