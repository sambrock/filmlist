import { useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api/client';

// import { trpc } from '@/lib/trpc';

export const useChatMessagesQuery = (threadId: string) => {
  return useInfiniteQuery({
    queryKey: ['chat', threadId, 'messages'],
    // queryFn: () => trpc.getChatMessages.query({ threadId, limit: 20 }),
    queryFn: async () => {
      const { data } = await api.GET('/api/messages/{threadId}', {
        params: {
          path: { threadId },
        },
      });

      return data;
    },
    initialPageParam: 0,
    getNextPageParam: () => 2,
  });
};
