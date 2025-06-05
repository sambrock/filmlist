import { ChatStoreProvider } from '@/providers/chat-store-provider';
import { ChatView } from '@/components/chat/chat-view';

type Props = {
  params: Promise<{ threadId: string }>;
};

export default async function ChatPage(props: Props) {
  const params = await props.params;

  return (
    <ChatStoreProvider threadId={params.threadId}>
      <ChatView threadId={params.threadId} />
    </ChatStoreProvider>
  );
}
