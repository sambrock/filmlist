import { useInfiniteQuery } from '@tanstack/react-query';

import { trpc } from '../trpc';

export const useThreadMessages = () => {
  return useInfiniteQuery({
    queryKey: ['threadId', 'messages'],
    queryFn: ({ pageParam }) => trpc.getThreadMessages.query({ threadId: '', cursor: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
