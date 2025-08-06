import { useClientStoreThreadId } from '@/providers/client-store-provider';
import { trpc } from '../trpc/client';

export const useThreadMessagesQuery = () => {
  const threadId = useClientStoreThreadId();

  const threadIdReplaced = threadId.replace('new:', '');

  return trpc.getThreadMessages.useInfiniteQuery(
    {
      threadId: threadIdReplaced,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 0,
      retryOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      enabled: !!threadIdReplaced,
    }
  );
};
