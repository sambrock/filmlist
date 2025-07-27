import { getThreadMessages } from './operations/get-thread-messages';
import { getUserThreads } from './operations/get-user-threads';
import { router } from './trpc';

export const appRouter = router({
  getThreadMessages,
  getUserThreads,
});

export type AppRouter = typeof appRouter;
