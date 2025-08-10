import { trpc } from '@/lib/trpc/client';
import { clearUuid, isDraftUuid } from '@/lib/utils/uuid';
import { useChatStore } from '@/providers/chat-store-provider';

export const useChatMessagesQuery = () => {
  const threadId = useChatStore((store) => store.threadId);

  return trpc.getThreadMessages.useInfiniteQuery(
    { threadId: clearUuid(threadId) },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [{ messages: [], nextCursor: 0 }], pageParams: [] },
      initialCursor: 0,
      retryOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      enabled: !isDraftUuid(threadId),
    }
  );
};
