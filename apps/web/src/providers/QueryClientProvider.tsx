import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const QueryClientProvider = (props: React.PropsWithChildren) => {
  return <ReactQueryClientProvider client={queryClient}>{props.children}</ReactQueryClientProvider>;
};
