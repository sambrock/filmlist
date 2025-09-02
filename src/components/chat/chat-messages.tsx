'use client';

import { Fragment, useLayoutEffect, useRef } from 'react';
import { useIsClient } from 'usehooks-ts';

import { trpc } from '@/lib/trpc/client';
import { useChatContext } from '@/providers/chat-context-provider';
import { useChatStore } from '@/providers/chat-store-provider';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';

export const ChatMessages = () => {
  const isClient = useIsClient();
  const divRef = useRef<HTMLDivElement>(null);

  const { chatId } = useChatContext();
  const isPersisted = useChatStore((store) => store.actions.getChat(chatId).isPersisted);

  const { data } = trpc.getChatMessages.useInfiniteQuery(
    { chatId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [{ messages: [], nextCursor: 0 }], pageParams: [] },
      initialCursor: 0,
      enabled: isPersisted,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retryOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  const messages = data?.pages.flatMap((page) => [...page.messages].reverse()) ?? [];

  useLayoutEffect(() => {
    if (!divRef.current) return;
    divRef.current.scrollIntoView({ behavior: 'instant', block: 'end' }); // Scroll to the bottom of the chat
  }, [messages]);

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
