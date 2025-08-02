import 'server-only';

import { initTRPC, TRPCError } from '@trpc/server';

import { Context } from './context';

const t = initTRPC.context<Context>().create({});

export const router = t.router;

// Middleware

export const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Procedures

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
