import { trpc } from '@/lib/trpc/client';
import { useChatContext } from '@/providers/chat-context-provider';
import { useClientStore } from '@/providers/client-store-provider';

export const useApiChatMessages = () => {
  const { chatId } = useChatContext();
  const { isPersisted } = useClientStore((store) => store.chat(chatId));

  const { data, ...rest } = trpc.getChatMessages.useInfiniteQuery(
    { chatId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [{ messages: [], nextCursor: 0 }], pageParams: [] },
      initialCursor: 0,
      enabled: isPersisted,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retryOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  const messages = [...data?.pages.flatMap((page) => page.messages)].reverse() || [];
  const hasPending = messages.some((message) => message.status === 'pending');

  return { messages, hasPending, ...rest };
};
