import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

import { type AppRouter } from '@filmlist/api';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:8787/trpc',
    }),
  ],
});
