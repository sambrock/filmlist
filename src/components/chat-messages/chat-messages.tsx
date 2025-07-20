'use client';

import { useChatMessagesInfiniteQuery } from '@/lib/api/useChatMessages';
import { scrollToEnd } from '@/lib/utils';
import { useChatThreadId } from '@/providers/chat-store-provider';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';
import { ChatMessagesFetchMore } from './chat-messages-fetch-more';

export const ChatMessages = () => {
  const threadId = useChatThreadId();
  const { data, fetchNextPage, isLoading } = useChatMessagesInfiniteQuery(threadId);

  // Scroll to end of chat on initial load (20 messages or less is the initial load size)
  if (data && data.pages.length <= 20) {
    // Use requestAnimationFrame to ensure the DOM is ready
    requestAnimationFrame(scrollToEnd);
  }

  const messages = data?.pages || [];

  return (
    <>
      {!isLoading && <ChatMessagesFetchMore fetchNextPage={fetchNextPage} />}

      {messages.map((message) => (
        <div key={message.messageId}>
          {message.role === 'user' && <ChatMessageUser message={message} />}
          {message.role === 'assistant' && (
            <ChatMessageAssistant message={message} recommendations={message.recommendations} />
          )}
        </div>
      ))}
    </>
  );
};
