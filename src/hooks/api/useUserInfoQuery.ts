import { useQuery } from '@tanstack/react-query';

import { trpc } from '@/lib/trpc';

export const useUserInfoQuery = (userId: string) => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => trpc.getUserInfo.query({ userId }),
  });
};
