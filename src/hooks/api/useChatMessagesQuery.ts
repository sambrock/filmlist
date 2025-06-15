import { useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api/client';

export const useChatMessagesQuery = (threadId: string) => {
  return useInfiniteQuery({
    queryKey: ['chat', threadId, 'messages'],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.GET('/api/messages/{threadId}', {
        params: {
          path: { threadId },
          query: {
            limit: 20,
            cursor: pageParam,
          },
        },
      });

      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
};
