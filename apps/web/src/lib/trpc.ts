import { createTRPCClient, httpLink } from '@trpc/client';

import type { AppRouter } from '@filmlist/api';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: 'http://localhost:8787/api',
    }),
  ],
});
