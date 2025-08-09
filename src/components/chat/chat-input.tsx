'use client';

import { useChatStore } from '@/providers/chat-store-provider';

export const ChatInput = () => {
  const [value, setValue] = useChatStore((s) => [s.value, s.actions.setValue] as const);

  return (
    <div>
      <textarea value={value} onChange={(e) => setValue(e.target.value)}></textarea>
    </div>
  );
};
