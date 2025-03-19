import { initTRPC } from '@trpc/server';

import { Database, initDatabase } from '@filmlist/drizzle';

export interface Context {
  env: {
    DB: {};
  };
  db: Database;
  user: {
    id: number;
    username: string;
  };
}

const t = initTRPC.context<Context>().create();
export const procedure = t.procedure;
export const router = t.router;
export const mergeRouters = t.mergeRouters;

export const procedureWithDatabase = procedure.use(({ ctx, next }) => {
  let db = ctx.db;
  if (!db) db = initDatabase(ctx.env.DB);

  return next({
    ctx: { ...ctx, db } satisfies Context,
  });
});

export const authedProcedure = procedureWithDatabase.use(({ ctx, next }) => {
  const user = { id: 1, username: 'username' }; // TODO: implement auth

  return next({
    ctx: { ...ctx, user } satisfies Context,
  });
});
