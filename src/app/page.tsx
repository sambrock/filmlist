import { unsavedUuid } from '@/lib/utils/uuid';
import { ChatContextProvider } from '@/providers/chat-context-provider';
import { ChatView } from '@/components/views/chat-view';

export default async function NewChatPage() {
  return (
    <ChatContextProvider chatId={unsavedUuid()}>
      <ChatView />
    </ChatContextProvider>
  );
}
