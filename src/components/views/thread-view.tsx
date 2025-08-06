'use client';

import { useIsClient } from 'usehooks-ts';

import { useAuthMe } from '@/lib/api/useAuthMe';
import { useChatStream } from '@/lib/api/useChatStream';
import { useThreadMessagesQuery } from '@/lib/api/useThreadMessagesQuery';
import {
  useClientStoreSetThreadId,
  useClientStoreThreadId,
  useClientStoreUserId,
} from '@/providers/client-store-provider';

type Props = {
  threadId: string;
  empty: boolean;
};

export const ThreadView = ({ empty, ...props }: Props) => {
  useClientStoreSetThreadId(props.threadId);
  useAuthMe();

  const isClient = useIsClient();
  const userId = useClientStoreUserId();
  const threadId = useClientStoreThreadId();
  const { mutate } = useChatStream();
  const threadMessagesQuery = useThreadMessagesQuery();

  const onChatInputSubmit = (value: string) => {
    if (threadId.startsWith('new:')) {
      window.history.pushState({}, '', `/chat/${threadId.replace('new:', '')}`);
    }
    mutate(value);
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }
  return (
    <main className="bg-background-1 border-foreground-0/10 h-full w-full overflow-y-scroll px-8 py-4">
      <div>
        <div>user-id: {userId}</div>
        <div>thread-id: {threadId}</div>

        {empty && <div>No messages in this thread.</div>}
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
    </main>
  );
};
