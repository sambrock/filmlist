'use client';

import { Id } from '@/convex/_generated/dataModel';
import { trpc } from '@/lib/trpc/provider';

type Props = {
  threadId: Id<'threads'>;
};

export const Message = ({ threadId }: Props) => {
  const chatMutation = trpc.chat.useMutation();

  const threadMessages = trpc.messages.useQuery(
    {
      threadId: threadId as string,
    },
    {
      // refetchInterval: 5000, // Refetch every 5 seconds
    }
  );

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
        {threadMessages?.data?.map((message) => (
          <div key={message._id}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>
    </div>
  );
};
