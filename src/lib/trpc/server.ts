import 'server-only';

import { cache } from 'react';
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';
import { createHydrationHelpers } from '@trpc/react-query/rsc';

import { appRouter, type AppRouter } from '@/server/router';
import { createCallerFactory, createContext } from '@/server/trpc';

export const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
      hydrate: {},
    },
  });
};

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createContext);

export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(caller, getQueryClient);
