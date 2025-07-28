'use client';

import { MessageUser } from '@/lib/drizzle';

type Props = {
  message: MessageUser;
};

export const ChatMessageUser = ({ message }: Props) => {
  return (
    <div className="bg-background-2 mt-8 ml-auto w-min rounded-lg p-3 whitespace-nowrap">
      {message.content}
    </div>
  );
};

export const ChatMessageUserPending = ({ content }: { content: string }) => {
  return (
    <div className="bg-background-2 mt-8 ml-auto w-min rounded-lg p-3 whitespace-nowrap">
      {content}
    </div>
  );
};
