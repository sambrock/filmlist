'use client';

import { useLayoutEffect, useRef } from 'react';
import { useIsClient } from 'usehooks-ts';

import { useChatMessagesQuery } from '@/hooks/useChatMessagesQuery';
import { ChatMessage } from './chat-message';

export const ChatMessages = () => {
  const chatMessagesQuery = useChatMessagesQuery();

  const divRef = useRef<HTMLDivElement>(null);

  const isClient = useIsClient();

  useLayoutEffect(() => {
    if (!divRef.current) return;
    // Scroll to the bottom of the chat
    divRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
  }, [chatMessagesQuery.data]);

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }
  return (
    <div ref={divRef} className="mt-8 space-y-4 pb-26">
      {chatMessagesQuery.data?.pages.map((page) =>
        [...page.messages]
          .reverse()
          .map((message) => (
            <ChatMessage
              key={message.user.messageId}
              messageUser={message.user}
              messageAssistant={message.assistant}
              movies={message.movies}
            />
          ))
      )}
    </div>
  );
};
