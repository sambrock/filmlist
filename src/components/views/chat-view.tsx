import { ChatStoreProvider } from '@/providers/chat-store-provider';
import { ChatInput } from '../chat/chat-input';
import { ChatMessages } from '../chat/chat-messages';

type Props = {
  threadId: string;
};

export const ChatView = ({ threadId }: Props) => {
  return (
    <ChatStoreProvider initialData={{ threadId }}>
      <main className="h-screen overflow-y-auto">
        <div className="relative mx-auto w-3xl">
          <ChatMessages />
          <ChatInput className="fixed bottom-4 z-10 w-3xl shadow-xl shadow-black/10" />
        </div>

        <div className="bg-background-0 fixed bottom-0 h-10 w-full"></div>
      </main>
    </ChatStoreProvider>
  );
};
