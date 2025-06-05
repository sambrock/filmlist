import { cache } from 'react';
import { initTRPC } from '@trpc/server';

export const createTRPCContext = cache(async () => {
  return {
    // auth : ...
  };
});

const t = initTRPC.create({});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
