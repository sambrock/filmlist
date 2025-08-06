import { useClientStoreUserId } from '@/providers/client-store-provider';
import { trpc } from '../trpc/client';

export const useThreadsQuery = () => {
  const userId = useClientStoreUserId();

  return trpc.getThreads.useQuery(
    { userId },
    {
      initialData: [],
      enabled: !!userId,
    }
  );
};
