import { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { useTRPC } from '../utils/trpc';

export const useChatMessagesInfiniteQuery = (threadId: string) => {
  const trpc = useTRPC();

  const cursorRef = useRef<number>(0);

  return useInfiniteQuery(
    trpc.getMessages.infiniteQueryOptions(
      {
        threadId,
        limit: 20,
        cursor: cursorRef.current,
      },
      {
        getNextPageParam: (lastPage) => {
          if (lastPage?.nextCursor) {
            cursorRef.current = lastPage.nextCursor;
            return lastPage.nextCursor;
          }
          return undefined;
        },
        retryOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
      }
    )
  );
};
