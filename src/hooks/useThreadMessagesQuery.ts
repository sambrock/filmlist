import { trpc } from '@/lib/trpc/client';
import { useClientStoreThreadId } from '@/providers/client-store-provider';

export const useThreadMessagesQuery = () => {
  const threadId = useClientStoreThreadId();

  const threadIdReplaced = threadId.replace('draft:', '');

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
