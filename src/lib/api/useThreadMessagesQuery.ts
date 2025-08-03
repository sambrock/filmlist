import { useInfiniteQuery } from '@tanstack/react-query';

import { useThreadContext } from '@/providers/thread-context-provider';
import { trpc } from '../trpc';

export const useThreadMessagesQuery = () => {
  const { threadId } = useThreadContext();

  return useInfiniteQuery({
    queryKey: ['thread', threadId, 'messages'],
    queryFn: ({ pageParam }) => {
      return trpc.getThreadMessages.query({
        threadId,
        cursor: pageParam,
        limit: 20,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
