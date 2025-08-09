import { HydrateClient } from '@/lib/trpc/server';
import { draftUuid } from '@/lib/utils/uuid';
import { ChatView } from '@/components/views/chat-view';

export default async function NewChatPage() {
  const draftThreadId = draftUuid();

  return (
    <HydrateClient>
      <ChatView threadId={draftThreadId} />
    </HydrateClient>
  );
}
