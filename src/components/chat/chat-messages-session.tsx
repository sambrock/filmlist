'use client';

import { useChatStore } from '@/providers/chat-store-provider';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';

type Props = React.ComponentProps<'div'>;

export const ChatMessagesSession = (props: Props) => {
  const messageStack = useChatStore((state) => [...state.messageStack.keys()]);

  return (
    <div className="space-y-6 pb-40 flex flex-col" {...props}>
      {messageStack.map((messageId) => (
        <ChatMessageSession key={messageId} messageId={messageId} />
      ))}
    </div>
  );
};

export const ChatMessageSession = (props: { messageId: string }) => {
  const message = useChatStore((state) => state.messageStack.get(props.messageId));

  if (!message) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {message.role === 'user' && <ChatMessageUser message={message} />}
      {message.role === 'assistant' && <ChatMessageAssistant message={message} />}
    </div>
  );
};
