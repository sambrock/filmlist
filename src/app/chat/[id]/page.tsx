import { HydrateClient, trpc } from '@/lib/trpc/server';
import { ChatView } from '@/components/views/chat-view';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ChatPage(props: Props) {
  const { id } = await props.params;

  void trpc.getChatMessages.prefetchInfinite({ threadId: id });

  return (
    <HydrateClient>
      <ChatView threadId={id} />
    </HydrateClient>
  );
}
