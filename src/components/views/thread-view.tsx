'use client';

import { useParams } from 'next/navigation';
import { useIsClient } from 'usehooks-ts';

import { useChatStream } from '@/lib/api/useChatStream';
import { useThreadMessagesQuery } from '@/lib/api/useThreadMessagesQuery';
import { useThreadContext } from '@/providers/thread-context-provider';
import { useUserContext } from '@/providers/user-context-provider';

export const ThreadView = () => {
  const params = useParams();

  const { user } = useUserContext();
  const { threadId } = useThreadContext();

  const chatStream = useChatStream();
  const threadMessagesQuery = useThreadMessagesQuery();

  const isClient = useIsClient();

  const onInputSubmit = (value: string) => {
    if (!params.threadId) {
      window.history.replaceState({}, '', `/${threadId}`);
    }
    chatStream.mutate(value);
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }
  return (
    <main className="bg-background-1 border-foreground-0/10 h-full w-full overflow-y-scroll px-8 py-4">
      <div>
        <div>user-id: {user?.userId}</div>
        <div>thread-id: {threadId}</div>
      </div>

      <input
        onKeyDown={(e) => {
          const value = (e.target as HTMLInputElement).value;
          if (e.key === 'Enter' && value.trim()) {
            onInputSubmit(value);
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
