import { generateUuid } from '@/lib/utils/uuid';
import { ChatStoreProvider } from '@/providers/chat-store-provider';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessagesSession } from '@/components/chat/chat-messages-session';
import { ChatMessagesStatic } from '@/components/chat/chat-messages-static';
import { ChatScrollIntoView } from '@/components/chat/chat-scroll-into-view';

type Props = {
  threadId?: string;
};

export default function ChatPage(props: Props) {
  const threadId = props.threadId || generateUuid();

  return (
    <ChatStoreProvider threadId={threadId} threadExists={props.threadId !== undefined}>
      <div className="bg-surface-1 relative flex h-full flex-col items-center overflow-y-auto">
        <div className="w-default">
          <ChatMessagesStatic />
          <ChatMessagesSession />
        </div>
        <ChatScrollIntoView />
        <div className="w-default bg-surface-1 fixed bottom-0 self-center rounded-t-xl pb-2">
          <ChatInput className="mb-3" />
        </div>
      </div>
    </ChatStoreProvider>
  );
}
