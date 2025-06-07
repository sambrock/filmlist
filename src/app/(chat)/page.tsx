import { generateUuid } from '@/lib/utils/uuid';
import { ChatStoreProvider } from '@/providers/chat-store-provider';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';

type Props = {
  threadId?: string;
};

export default function ChatPage(props: Props) {
  const threadId = props.threadId || generateUuid();

  return (
    <ChatStoreProvider threadId={threadId} threadExists={props.threadId !== undefined}>
      <div className="bg-surface-1 relative flex h-full flex-col items-center overflow-y-auto">
        <ChatMessages className="w-default" />
        <ChatInput className="w-default fixed bottom-4 self-center" />
      </div>
    </ChatStoreProvider>
  );
}
