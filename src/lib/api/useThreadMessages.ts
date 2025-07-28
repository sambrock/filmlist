import { useInfiniteQuery } from '@tanstack/react-query';

import { useThreadContext } from '@/providers/thread-provider';
import { trpc } from '../trpc';

export const useThreadMessages = () => {
  const { threadId } = useThreadContext();

  return useInfiniteQuery({
    queryKey: [threadId, 'messages'],
    queryFn: ({ pageParam }) => trpc.getThreadMessages.query({ threadId, cursor: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
