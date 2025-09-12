import { ChatView } from '@/components/views/chat-view';

type Props = {
  params: Promise<{ thread_id: string }>;
};

export default async function ChatPage({ params }: Props) {
  const { thread_id } = await params;

  return <ChatView threadId={thread_id} isPersisted={true} />;
}
