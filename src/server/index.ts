import { getThreadMessages } from './operations/get-thread-messages';
import { getUserInfo } from './operations/get-user-info';
import { getUserThreads } from './operations/get-user-threads';
import { router } from './trpc';

export const appRouter = router({
  getThreadMessages,
  getUserThreads,
  getUserInfo,
});

export type AppRouter = typeof appRouter;
