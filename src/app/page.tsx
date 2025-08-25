import { HydrateClient } from '@/lib/trpc/server';
import { unsavedUuid } from '@/lib/utils/uuid';
import { ChatView } from '@/components/views/chat-view';

export default async function NewChatPage() {
  const unsavedThreadId = unsavedUuid();

  return (
    <HydrateClient>
      <ChatView threadId={unsavedThreadId} />
    </HydrateClient>
  );
}
