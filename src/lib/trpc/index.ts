import { createTRPCClient, httpBatchLink, httpSubscriptionLink, splitLink } from '@trpc/client';

import type { AppRouter } from './routers/app.router';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    // httpBatchLink({
    //   url: 'http://localhost:3000/api/trpc',
    // }),
    splitLink({
      // uses the httpSubscriptionLink for subscriptions
      condition: (op) => op.type === 'subscription',
      true: httpSubscriptionLink({
        url: `/api/trpc`,
      }),
      false: httpBatchLink({
        url: `/api/trpc`,
      }),
    }),
  ],
});
