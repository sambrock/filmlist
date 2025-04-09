import { createTRPCClient, httpBatchLink } from '@trpc/client';

import type { AppRouter } from '@filmlist/api';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:8787',
    }),
  ],
});

