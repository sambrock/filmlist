'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useIntersectionObserver, useIsClient } from 'usehooks-ts';

import { MessageContextProvider } from '@/providers/message-context-provider';
import { useApiChatMessages } from '@/hooks/use-api-chat-messages';
import { SpinnerEllipsis } from '../common/spinner';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';

export const ChatMessages = () => {
  const { messages, hasPending, fetchNextPage, fetchStatus } = useApiChatMessages();

  const isInit = useRef(false);
  const divRef = useRef<HTMLDivElement>(null);
  const enableFetchMore = useRef(false);

  const isClient = useIsClient();

  const messagesLength = messages.length;
  const lastMessage = messages[messages.length - 1];
  const latestMessageContentLength = lastMessage?.content.length || 0;

  useLayoutEffect(() => {
    if (!divRef.current || !hasPending) return;
    divRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
  }, [messagesLength, latestMessageContentLength, hasPending]);

  useLayoutEffect(() => {
    if (isInit.current || !divRef.current) return;
    divRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
    isInit.current = true;
    enableFetchMore.current = true;
  });

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    if (enableFetchMore.current && isIntersecting && fetchStatus !== 'fetching') {
      console.log('FETCH MORE');
      fetchNextPage();
    }
  }, [isIntersecting, fetchStatus, fetchNextPage]);

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }
  return (
    <div ref={divRef} className="mt-8 space-y-4 pb-36">
      <div ref={ref} className="invisible" />

      {messages.map((message) => (
        <MessageContextProvider key={message.messageId} messageId={message.messageId}>
          {message.role === 'user' && <ChatMessageUser message={message} />}
          {message.role === 'assistant' && <ChatMessageAssistant message={message} />}
        </MessageContextProvider>
      ))}
      {((lastMessage?.role === 'user' && lastMessage?.status === 'pending') ||
        (lastMessage?.role === 'assistant' &&
          lastMessage?.status === 'pending' &&
          !lastMessage?.content)) && <SpinnerEllipsis className="text-foreground-1 mt-4" />}
    </div>
  );
};
