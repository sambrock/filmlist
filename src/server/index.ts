import { getAuthMe } from './operations/get-auth-me';
import { getThread } from './operations/get-thread';
import { getThreadMessages } from './operations/get-thread-messages';
import { getThreads } from './operations/get-threads';
import { router } from './trpc';

export const appRouter = router({
  getAuthMe,
  getThreads,
  getThreadMessages,
  getThread,
});

export type AppRouter = typeof appRouter;
