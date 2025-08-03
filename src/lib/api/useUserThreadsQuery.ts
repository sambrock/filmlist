import { useQuery } from '@tanstack/react-query';

import { useUserContext } from '@/providers/user-context-provider';
import { trpc } from '../trpc';

export const useUserThreadsQuery = () => {
  const { user } = useUserContext();

  return useQuery({
    queryKey: ['threads'],
    queryFn: () => trpc.getUserThreads.query(user!.userId),
    enabled: !!user?.userId,
  });
};
