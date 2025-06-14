'use client';

import { QueryClientProvider as Provider, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({});

export const QueryClientProvider = (props: React.PropsWithChildren) => {
  return <Provider client={queryClient}>{props.children}</Provider>;
};

// type HydrateClientProps = {
//   dehydratedState: unknown;
// };

// export const HydrateQueryClient = ({ dehydratedState }: HydrateClientProps) => {
//   hydrate(queryClient, dehydratedState);

//   return null;
// };

// function makeQueryClient() {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         // With SSR, we usually want to set some default staleTime
//         // above 0 to avoid refetching immediately on the client
//         staleTime: 60 * 1000,
//       },
//     },
//   });
// }
// let browserQueryClient: QueryClient | undefined = undefined;
// function getQueryClient() {
//   if (typeof window === 'undefined') {
//     // Server: always make a new query client
//     return makeQueryClient();
//   } else {
//     // Browser: make a new query client if we don't already have one
//     // This is very important, so we don't re-make a new client if React
//     // suspends during the initial render. This may not be needed if we
//     // have a suspense boundary BELOW the creation of the query client
//     if (!browserQueryClient) browserQueryClient = makeQueryClient();
//     return browserQueryClient;
//   }
// }
