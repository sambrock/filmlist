import { useQuery } from '@tanstack/react-query';

import { trpc } from '@/lib/trpc/api';

export const useUserThreads = (userId: string) => {
  return useQuery({
    queryKey: ['threads', userId],
    queryFn: () => trpc.getUserThreads.query({ userId }),
    enabled: Boolean(userId),
    initialData: [],
  });
};
