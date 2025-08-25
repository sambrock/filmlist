import { cn } from '@/lib/utils/cn';
import { ChatStoreProvider } from '@/providers/chat-store-provider';
import { ChatInput } from '../chat/chat-input';
import { ChatMessages } from '../chat/chat-messages';

type Props = {
  threadId: string;
};

export const ChatView = ({ threadId }: Props) => {
  return (
    <ChatStoreProvider initialData={{ threadId }}>
      <main className={cn('h-[calc(100%-40px)] overflow-y-scroll')}>
        <div className="relative mx-auto w-3xl">
          <ChatMessages />
          <ChatInput className="fixed bottom-4 w-3xl" />
        </div>
      </main>
    </ChatStoreProvider>
  );
};
