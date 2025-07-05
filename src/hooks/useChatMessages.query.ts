import { useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

export const useChatMessagesInfiniteQuery = (threadId: string) => {
  return useInfiniteQuery({
    queryKey: [threadId, 'messages'],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.GET('/api/messages/{threadId}', {
        params: {
          path: { threadId },
          query: { limit: 20, cursor: pageParam },
        },
      });

      return data;
    },
    select: (data) => {
      return data?.pages.flatMap((page) => page!.messages.reverse()) || [];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
