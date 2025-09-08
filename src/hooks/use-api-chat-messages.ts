import { trpc } from '@/lib/trpc/client';
import { useChatContext } from '@/providers/chat-context-provider';
import { useClientStore } from '@/providers/client-store-provider';

export const useApiChatMessages = () => {
  const { chatId } = useChatContext();
  const { isPersisted } = useClientStore((store) => store.chat(chatId));

  const query = trpc.getChatMessages.useQuery(
    { chatId },
    {
      initialData: { messages: [], nextCursor: null },
      // initialDataUpdatedAt: Date.now(),
      enabled: isPersisted,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retryOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  const messages = [...(query.data?.messages || [])].reverse();
  const hasPending = messages.some((message) => message.status === 'pending');
  const latestMessage = messages[0];

  return { ...query, messages, hasPending, latestMessage };
};
