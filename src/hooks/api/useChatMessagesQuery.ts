import { useInfiniteQuery } from '@tanstack/react-query';

import { trpc } from '@/lib/trpc';

export const useChatMessagesQuery = (threadId: string) => {
  return useInfiniteQuery({
    queryKey: ['chat', threadId, 'messages'],
    queryFn: () => trpc.getChatMessages.query({ threadId, limit: 20 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
