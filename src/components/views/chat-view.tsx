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
      <div className="from-background-1 relative bg-linear-to-b to-[#22232D]">
        <div className="absolute bottom-[52px] z-40 h-6 w-full bg-linear-to-t from-[#22232D] to-transparent"></div>
        <main className={cn('h-[calc(100vh-52px)] overflow-y-scroll')}>
          <div className="relative mx-auto w-3xl">
            <ChatMessages />
            <ChatInput className="fixed bottom-6 z-50 w-3xl shadow-lg shadow-black/10" />
          </div>
        </main>
      </div>
    </ChatStoreProvider>
  );
};
