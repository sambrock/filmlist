'use client';

import { useIsClient } from 'usehooks-ts';

import { useChat } from '@/lib/api/useChat';

export const Chat = () => {
  const { mutate } = useChat();
  const isClient = useIsClient();

  const onChatInputSubmit = (value: string) => {
    mutate(value);
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }
  return (
    <div className="">
      <input
        onKeyDown={(e) => {
          const value = (e.target as HTMLInputElement).value;
          if (e.key === 'Enter' && value.trim()) {
            onChatInputSubmit(value);
          }
        }}
      />
    </div>
  );
};
