'use client';

import { useEffect, useRef } from 'react';

import { useChatStore } from '@/providers/chat-store-provider';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';

type Props = React.ComponentProps<'div'>;

export const ChatMessagesSession = (props: Props) => {
  const messageStack = useChatStore((state) => [...state.messageStack.keys()]);

  const scrollIntoViewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col space-y-6" {...props}>
      {messageStack.map((messageId) => (
        <ChatMessageSession key={messageId} messageId={messageId} scrollRef={scrollIntoViewRef} />
      ))}
      <div ref={scrollIntoViewRef} className="mt-40" />
    </div>
  );
};

export const ChatMessageSession = (props: {
  messageId: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const message = useChatStore((state) => state.messageStack.get(props.messageId));

  useEffect(() => {
    if (!message && props.scrollRef) return;
    props.scrollRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
  }, [message?.content]);

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
