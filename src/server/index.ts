import { getThreadMessages } from './operations/get-thread-messages';
import { getUser } from './operations/get-user';
import { getUserThreads } from './operations/get-user-threads';
import { router } from './trpc';

export const appRouter = router({
  getUser,
  getUserThreads,
  getThreadMessages,
});

export type AppRouter = typeof appRouter;
