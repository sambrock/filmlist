'use client';

import { Fragment } from 'react';

import { useChatMessagesInfiniteQuery } from '@/lib/api/useChatMessages';
import { scrollToEnd } from '@/lib/utils';
import { useChatMessages, useChatThreadId } from '@/providers/chat-store-provider';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageRecommendationPending } from './chat-message-recommendation';
import { ChatMessageUser, ChatMessageUserPending } from './chat-message-user';
import { ChatMessagesFetchMore } from './chat-messages-fetch-more';

export const ChatMessages = () => {
  const threadId = useChatThreadId();

  const chatMessagesQuery = useChatMessagesInfiniteQuery(threadId);
  const chatMessages = useChatMessages();

  // Scroll to end of chat on initial load (20 messages or less is the initial load size)
  if (chatMessagesQuery.data && chatMessagesQuery.data.pages.length <= 20) {
    // Use requestAnimationFrame to ensure the DOM is ready
    requestAnimationFrame(scrollToEnd);
  }

  const pendingMessages = chatMessages.filter((m) => m.status === 'pending');
  const doneMessages = chatMessages
    .filter((m) => m.status === 'done')
    .map((m) => [m.messageUser, m.messageAssistant])
    .flat();

  const messages = [...(chatMessagesQuery?.data?.pages || []), ...doneMessages];

  return (
    <Fragment>
      {!chatMessagesQuery?.isLoading && (
        <ChatMessagesFetchMore fetchNextPage={chatMessagesQuery.fetchNextPage} />
      )}

      {messages.map((message) => (
        <div key={message.messageId}>
          {message.role === 'user' && <ChatMessageUser message={message} />}
          {message.role === 'assistant' && <ChatMessageAssistant message={message} />}
        </div>
      ))}

      {pendingMessages.map((message, index) => (
        <div key={index}>
          <ChatMessageUserPending content={message.messageUser.content} />
          <div className="space-y-2">
            {message.messageAssistant.recommendations.map((recommendation, index) => (
              <ChatMessageRecommendationPending key={index} recommendation={recommendation} />
            ))}
          </div>
        </div>
      ))}

      {/* <ChatMessageRecommendationPending
        recommendation={{
          title: 'Loading',
          releaseYear: '1998',
          why: 'This is a placeholder recommendation while the actual data is being fetched.',
        }}
      /> */}
    </Fragment>
  );
};
