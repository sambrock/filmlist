import { initTRPC } from '@trpc/server';

import { DrizzleDatabase, initDrizzleDatabase } from '@filmlist/drizzle';

export interface Context {
  env: {
    DB: {};
  };
  db: DrizzleDatabase;
  user: {
    id: number;
    username: string;
  };
}

const t = initTRPC.context<Context>().create();

export const procedure = t.procedure;
export const router = t.router;
export const mergeRouters = t.mergeRouters;

/* Middleware */

export const middlewareAuth = t.middleware(({ ctx, next }) => {
  const user = { id: 1, username: 'username' }; // TODO: implement auth

  return next({
    ctx: { ...ctx, user } satisfies Context,
  });
});

export const middlewareDatabase = t.middleware(({ ctx, next }) => {
  let db = ctx.db;
  if (!db) db = initDrizzleDatabase(ctx.env.DB);

  return next({
    ctx: { ...ctx, db } satisfies Context,
  });
});
