import { createTRPCClient, httpBatchLink } from '@trpc/client';

import type { AppRouter } from './routers/app.router';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
});
