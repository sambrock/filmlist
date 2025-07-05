'use client';

import { Fragment, useEffect, useRef } from 'react';

import { scrollToEnd } from '@/lib/utils/app.utils';
import { useChatStore } from '@/providers/chat-store-provider';
import { ChatMessageAssistant } from '../chat-messages/chat-message-assistant';
import { ChatMessageUser } from '../chat-messages/chat-message-user';
import { ChatMessagesList } from './chat-messages-list';

export const ChatMessagesPending = () => {
  const messages = useChatStore((store) => [...store.messages.values()]);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const observer = new ResizeObserver(scrollToEnd);
    observer.observe(divRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <ChatMessagesList ref={divRef} className="mt-4">
      {messages.map((message) => (
        <Fragment key={message.key}>
          <ChatMessageUser message={message.user} />
          <ChatMessageAssistant message={message.assistant} movies={message.movies} />
        </Fragment>
      ))}
    </ChatMessagesList>
  );
};
