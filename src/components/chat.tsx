'use client';

import { useIsClient } from 'usehooks-ts';

import { useChat } from '@/lib/api/useChat';
import { useThreadMessages } from '@/lib/api/useThreadMessages';
import { useUserInfo } from '@/lib/api/useUserInfo';

export const Chat = () => {
  const userInfo = useUserInfo();
  const threadMessages = useThreadMessages();
  const { mutate } = useChat();

  const isClient = useIsClient();

  const onChatInputSubmit = (value: string) => {
    mutate(value);
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }
  return (
    <div className="overflow-y-scroll px-8">
      <div>{userInfo.data?.userId}</div>
      <input
        onKeyDown={(e) => {
          const value = (e.target as HTMLInputElement).value;
          if (e.key === 'Enter' && value.trim()) {
            onChatInputSubmit(value);
          }
        }}
      />

      {threadMessages.data?.pages.map((page) =>
        [...page.messages].reverse().map((message) => (
          <div key={message.messageId}>
            {message.role}: {message.content}
          </div>
        ))
      )}
    </div>
  );
};
