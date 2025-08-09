import { useClientStoreUserId } from '@/providers/global-store-provider';
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
