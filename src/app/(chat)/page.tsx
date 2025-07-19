import { ChatStoreProvider } from '@/providers/chat-store-provider';
import { ChatMessages } from '@/components/chat-messages/chat-messages';
import { ChatMessagesPending } from '@/components/chat-messages/chat-messages-pending';
import { ChatInput } from '@/components/chat/chat-input';

export default function ChatPage() {
  const threadId = 'de97710d-22b0-46d1-8116-5d7f493eb7a9';

  return (
    <ChatStoreProvider threadId={threadId} threadExists={true}>
      <main className="bg-background-1 relative flex h-full flex-col items-center overflow-y-auto">
        <div className="mb-40 w-3xl">
          <ChatMessages />
          <ChatMessagesPending />
        </div>

        <div className="bg-background-1 fixed bottom-0 pb-4">
          <ChatInput className="-mt-4" />
        </div>

        <div id="chat-end" />
      </main>
    </ChatStoreProvider>
  );
}
