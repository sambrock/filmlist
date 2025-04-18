import { createTRPCClient, httpLink } from '@trpc/client';
import superjson from 'superjson';

import type { AppRouter } from '@repo/api';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: 'http://localhost:8787/api',
      transformer: superjson,
    }),
  ],
});
