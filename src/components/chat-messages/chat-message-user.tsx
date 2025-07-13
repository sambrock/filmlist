'use client';

import type { Message } from '@/lib/drizzle/zod';

type Props = {
  message: Partial<Message>;
};

export const ChatMessageUser = ({ message }: Props) => {
  return (
    <div className="bg-background-2 mt-8 ml-auto w-min rounded-lg p-3 whitespace-nowrap">
      {message.content}
    </div>
  );
};
