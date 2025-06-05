import { baseProcedure, createTRPCRouter } from '../init';
import { chatRouter } from './chat.router';
import { threadsRouter } from './threads.router';

export type AppRouter = typeof appRouter;

export const appRouter = createTRPCRouter({
  ping: baseProcedure.query(() => ({ message: 'OK' })),

  chat: chatRouter,
  threads: threadsRouter,
});
