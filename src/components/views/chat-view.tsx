import { ChatStoreProvider } from '@/providers/chat-store-provider';
import { ChatInput } from '../chat/chat-input';

type Props = {
  threadId: string;
};

export const ChatView = ({ threadId }: Props) => {
  return (
    <ChatStoreProvider initialData={{ threadId }}>
      <main className="bg-background-1/90 border-foreground-0/10 h-full w-full overflow-y-scroll bg-[url(/noise.svg)] px-8">
        <div className="relative mx-auto h-screen w-3xl">
          <ChatInput className="fixed bottom-0 w-3xl" />
        </div>
      </main>
    </ChatStoreProvider>
  );
};
