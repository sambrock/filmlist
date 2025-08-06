import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '@/server';
import { createTRPCContext } from '@/server/trpc';

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: createTRPCContext,
  });
};

export { handler as GET, handler as POST };
