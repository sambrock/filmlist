'use client';

import { cn } from '@/lib/utils/cn.util';
import { useChatStore } from '@/providers/chat-store-provider';
import { useChatMessagesQuery } from '@/hooks/api/useChatMessagesQuery';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';

type Props = React.ComponentProps<'div'>;

export const ChatMessagesStatic = ({ className, ...props }: Props) => {
  const threadId = useChatStore((state) => state.threadId);

  const messagesQuery = useChatMessagesQuery(threadId);

  const messages = messagesQuery.data?.pages.flatMap((page) => page.messages).reverse();

  return (
    <div className={cn('space-y-6', className)} {...props}>
      {messages?.map((message) => (
        <div key={message.messageId} className="flex flex-col">
          {message.role === 'user' && <ChatMessageUser message={message} />}
          {message.role === 'assistant' && <ChatMessageAssistant message={message} />}
        </div>
      ))}
    </div>
  );
};
