import { getMessagesProcedures } from './operations/get-messages';
import { router } from './trpc';

export const appRouter = router({
  getMessages: getMessagesProcedures,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
