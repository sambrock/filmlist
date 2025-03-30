'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const GlobalQueryClientProvider = (props: React.PropsWithChildren) => {
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
};
