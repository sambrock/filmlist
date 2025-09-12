import { generateUuid } from '@/lib/utils';
import { ChatView } from '@/components/views/chat-view';

export default function NewChatPage() {
  const threadId = generateUuid();

  return <ChatView threadId={threadId} isPersisted={false} />;
}
