'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { trpc } from '@/lib/trpc/provider';

type Props = {
  threadId: Id<'threads'>;
};

export const Message = ({ threadId }: Props) => {
  const chatMutation = trpc.chat.useMutation();

  const threadMessages = useQuery(api.messages.getThreadMessages, {
    threadId,
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your message"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            chatMutation.mutate({
              content: e.currentTarget.value,
              threadId: threadId as string,
            });
          }
        }}
      />

      <div>
        {threadMessages?.map((message) => (
          <div key={message._id}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>
    </div>
  );
};
