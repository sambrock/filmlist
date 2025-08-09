'use client';

import { useIsClient } from 'usehooks-ts';

import { useChatStream } from '@/lib/hooks/useChatStream';
import { useThreadMessagesQuery } from '@/lib/hooks/useThreadMessagesQuery';

export const Chat = ({ threadId }: { threadId: string }) => {
  const { mutate } = useChatStream();
  const isClient = useIsClient();

  // const user =
  const threadMessagesQuery = useThreadMessagesQuery();

  const onChatInputSubmit = (value: string) => {
    mutate(value);
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }
  return (
    <div className="">
      <div>
        <div>user-id: {userQuery.data?.userId}</div>
        <div>thread-id: {threadQuery.data?.threadId}</div>
      </div>

      <input
        onKeyDown={(e) => {
          const value = (e.target as HTMLInputElement).value;
          if (e.key === 'Enter' && value.trim()) {
            onChatInputSubmit(value);
          }
        }}
      />

      {threadMessagesQuery.data?.pages.map((page) =>
        [...page.messages].reverse().map((message) => (
          <div key={message.messageId}>
            <div>{message.role}</div>
            <div>{message.content}</div>
          </div>
        ))
      )}
    </div>
  );
};
