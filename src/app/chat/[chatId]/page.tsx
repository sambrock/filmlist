import { HydrateClient, trpc } from '@/lib/trpc/server';
import { ChatContextProvider } from '@/providers/chat-context-provider';
import { ChatView } from '@/components/views/chat-view';

type Props = {
  params: Promise<{ chatId: string }>;
};

export default async function ChatPage(props: Props) {
  const { chatId } = await props.params;

  await trpc.getChatMessages.prefetchInfinite({ chatId });

  return (
    <HydrateClient>
      <ChatContextProvider chatId={chatId}>
        <ChatView />
      </ChatContextProvider>
    </HydrateClient>
  );
}
