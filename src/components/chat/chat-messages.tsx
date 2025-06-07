'use client';

import { cn } from '@/lib/utils/cn';
import { useChatStore } from '@/providers/chat-store-provider';
import { useChatMessagesQuery } from '@/hooks/api/useChatMessagesQuery';
import { usePendingMessage, usePendingMessageResponse } from '@/hooks/api/useSendMessageMutation';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';

type Props = React.ComponentProps<'div'>;

export const ChatMessages = ({ className, ...props }: Props) => {
  const threadId = useChatStore((state) => state.threadId);

  const messagesQuery = useChatMessagesQuery(threadId);
  const pendingMessages = usePendingMessage();
  const pendingMessageResponse = usePendingMessageResponse();

  const messages = messagesQuery.data?.pages.flatMap((page) => page.messages).reverse();

  return (
    <div className={cn('space-y-6 pb-40', className)} {...props}>
      {messages?.map((message) => (
        <div key={message.messageId} className="flex flex-col">
          {message.role === 'user' && <ChatMessageUser message={message} />}
          {message.role === 'assistant' && <ChatMessageAssistant message={message} />}
        </div>
      ))}
      <div className="flex flex-col">
        {pendingMessages[pendingMessages.length - 1] &&
          !messages
            ?.map((m) => m.messageId)
            .includes(pendingMessages[pendingMessages.length - 1].messageId) && (
            <ChatMessageUser message={pendingMessages[pendingMessages.length - 1]} />
          )}
        {pendingMessageResponse.data && <div>{pendingMessageResponse.data}</div>}
      </div>
    </div>
  );
};
