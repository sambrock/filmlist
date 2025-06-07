import { createTRPCClient, httpBatchLink, httpSubscriptionLink, splitLink } from '@trpc/client';
import superjson from 'superjson';

import type { AppRouter } from './router';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: httpSubscriptionLink({
        url: `/api/trpc`,
        transformer: superjson,
      }),
      false: httpBatchLink({
        url: `/api/trpc`,
        transformer: superjson,
      }),
    }),
  ],
});
