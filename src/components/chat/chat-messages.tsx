'use client';

import { useLayoutEffect, useRef } from 'react';
import { useIsClient } from 'usehooks-ts';

import { MessageContextProvider } from '@/providers/message-context-provider';
import { useApiChatMessages } from '@/hooks/use-api-chat-messages';
import { SpinnerEllipsis } from '../common/spinner';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';

export const ChatMessages = () => {
  const { messages, hasPending } = useApiChatMessages();

  const isFirstRender = useRef(true);
  const divRef = useRef<HTMLDivElement>(null);

  const isClient = useIsClient();

  const lastMessage = messages[messages.length - 1];

  // Scroll to bottom on first render
  useLayoutEffect(() => {
    if (!divRef.current || !isFirstRender) return;
    divRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
    isFirstRender.current = false;
  });

  // Scroll to bottom when message content is streamed
  useLayoutEffect(() => {
    if (!divRef.current || !hasPending || !lastMessage) return;
    divRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
  }, [lastMessage?.content.length]);

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }
  return (
    <div ref={divRef} className="mt-8 space-y-4 pb-36">
      {messages.map((message) => (
        <MessageContextProvider key={message.messageId} messageId={message.messageId}>
          {message.role === 'user' && <ChatMessageUser message={message} />}
          {message.role === 'assistant' && <ChatMessageAssistant message={message} />}
        </MessageContextProvider>
      ))}

      {hasPending &&
        (lastMessage.role === 'user' || (lastMessage.role === 'assistant' && !lastMessage.content)) && (
          <SpinnerEllipsis className="text-foreground-1 mt-4" />
        )}
    </div>
  );
};
