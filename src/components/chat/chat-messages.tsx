'use client';

import { Fragment, useLayoutEffect, useRef } from 'react';
import { useIsClient } from 'usehooks-ts';

import { useChatMessages } from '@/hooks/use-chat-messages';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';

export const ChatMessages = () => {
  const messages = useChatMessages();

  const divRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();

  const messagesLength = messages.length;
  const firstMessageContentLength = messages[0]?.content.length ?? 0;

  useLayoutEffect(() => {
    if (!divRef.current) return;
    divRef.current.scrollIntoView({ behavior: 'instant', block: 'end' }); // Scroll to the bottom of the chat
  }, [messagesLength, firstMessageContentLength]);

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }
  return (
    <div ref={divRef} className="mt-8 space-y-4 pb-36">
      {messages.map((message) => (
        <Fragment key={message.messageId}>
          {message.role === 'user' && <ChatMessageUser message={message} />}
          {message.role === 'assistant' && <ChatMessageAssistant message={message} />}
        </Fragment>
      ))}
    </div>
  );
};
