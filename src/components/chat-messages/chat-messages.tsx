'use client';

import { scrollToEnd } from '@/lib/utils/app.utils';
import { useChatThreadId } from '@/providers/chat-store-provider';
import { useChatMessagesInfiniteQuery } from '@/hooks/useChatMessages.query';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';
import { ChatMessagesList } from './chat-messages-list';

export const ChatMessages = () => {
  const threadId = useChatThreadId();
  const { data, fetchNextPage, isLoading } = useChatMessagesInfiniteQuery(threadId);

  // Scroll to end of chat on initial load (20 messages or less is the initial load size)
  if (data && data.length <= 20) {
    // Use requestAnimationFrame to ensure the DOM is ready
    requestAnimationFrame(scrollToEnd);
  }

  return (
    <ChatMessagesList>
      {/* {!isLoading && <ChatMessagesFetchMore fetchNextPage={fetchNextPage} />} */}
      {data?.map(({ message, movies }) => (
        <div key={message.messageId}>
          {message.role === 'user' && <ChatMessageUser message={message} />}
          {message.role === 'assistant' && <ChatMessageAssistant message={message} movies={movies} />}
        </div>
      ))}
    </ChatMessagesList>
  );
};
