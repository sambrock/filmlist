'use client';

import { useIsClient } from 'usehooks-ts';

import { useChatMessagesQuery } from '@/hooks/useChatMessagesQuery';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';

export const ChatMessages = () => {
  const chatMessagesQuery = useChatMessagesQuery();

  const isClient = useIsClient();

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }
  return (
    <div className="mt-10 mb-20 space-y-4">
      {chatMessagesQuery.data?.pages.map((page) =>
        [...page.messages].reverse().map((message) => (
          <div key={message.messageId} data-message-id={message.messageId}>
            {message.role === 'user' && <ChatMessageUser message={message} />}
            {message.role === 'assistant' && <ChatMessageAssistant message={message} />}
          </div>
        ))
      )}
    </div>
  );
};
