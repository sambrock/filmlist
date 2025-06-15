import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api/client';

export const useUserThreadsQuery = (userId: string) => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await api.GET('/api/user-threads/{userId}', {
        params: {
          path: { userId },
        },
      });

      return data;
    },
  });
};
