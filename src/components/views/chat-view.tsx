import { ChatStoreProvider } from '@/providers/chat-store-provider';
import { ChatInput } from '../chat/chat-input';

type Props = {
  threadId: string;
};

export const ChatView = ({ threadId }: Props) => {
  return (
    <ChatStoreProvider initialData={{ threadId }}>
      <main className="bg-background-1 border-foreground-0/10 h-full w-full overflow-y-scroll px-8 py-4">
        <ChatInput />
      </main>
    </ChatStoreProvider>
  );
};
