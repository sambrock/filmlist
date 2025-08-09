import { trpc } from '@/lib/trpc/client';

export const useGetUserQuery = () => {
  return trpc.getUser.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
