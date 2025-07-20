import { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { useTRPC } from '../trpc';

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
        select: (data) => {
          // Reverse the messages to maintain the order from oldest to newest
          return {
            ...data,
            pages: data.pages
              .reverse()
              .map((page) => page.messages.reverse())
              .flat(),
          };
        },
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
