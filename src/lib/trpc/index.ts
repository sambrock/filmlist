import { createTRPCClient, httpBatchLink } from '@trpc/client';

// import { createTRPCNext } from '@trpc/next';

import type { AppRouter } from './routers/_app';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
});

// export const trpc = createTRPCNext<AppRouter>({
//   config: () => {
//     return {
//       links: [
//         httpBatchLink({
//           url: `http://localhost:3000/api/trpc`,
//         }),
//       ],
//     };
//   },
//   ssr: false,
// });
