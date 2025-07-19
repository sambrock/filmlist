'use client';

import { useEffect, useRef } from 'react';

import { scrollToEnd } from '@/lib/utils';
import { useChatStore } from '@/providers/chat-store-provider';
import { ChatMessageUser } from '../chat-messages/chat-message-user';

export const ChatMessagesPending = () => {
  const messages = useChatStore((store) => store.messages);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const observer = new ResizeObserver(scrollToEnd);
    observer.observe(divRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={divRef}>
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessageUser message={message.user} />
          {message.assistant.recommendations?.map((recommendation, index) => (
            <div key={index}>
              <div>{recommendation?.movie?.source?.id}</div>
              <div>{recommendation?.title}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
