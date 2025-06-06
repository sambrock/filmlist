import { useQuery } from '@tanstack/react-query';

import { trpc } from '@/lib/trpc';

export const useThreadMessagesQuery = (threadId: string) => {
  return useQuery({
    queryKey: ['thread', threadId, 'messages'],
    queryFn: () => trpc.messages.getMessagesByThread.query({ threadId }),
    enabled: Boolean(threadId),
    initialData: [],
  });
};
