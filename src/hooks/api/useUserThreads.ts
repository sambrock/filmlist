import { useQuery } from '@tanstack/react-query';

import { trpc } from '@/lib/trpc';

export const useUserThreads = (userId: string) => {
  return useQuery({
    queryKey: ['threads', userId],
    queryFn: () => trpc.threads.getUserThreads.query({ userId }),
    enabled: Boolean(userId),
    initialData: [],
  });
};
