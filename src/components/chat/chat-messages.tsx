'use client';

import { useEffect, useState } from 'react';

import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils/cn';

type Props = React.ComponentProps<'div'>;

export const ChatMessages = ({ className, ...props }: Props) => {
  // const threadId = useChatStore((state) => state.threadId);

  // const messagesQuery = useThreadMessagesQuery(threadId);

  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    trpc.chat.timeStream.subscribe(
      {
        intervalMs: 1000,
      },
      {
        onData: (data) => setTime(data),
      }
    );
  }, []);

  return (
    <div className={cn('space-y-2 pb-40', className)} {...props}>
      {time}
      {/* {messagesQuery.data.map((message) => (
        <div key={message.messageId}>
          {message.role}: {message.content}
        </div>
      ))} */}
    </div>
  );
};
