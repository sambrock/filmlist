import { useMutation } from '@tanstack/react-query';

import { trpc } from '@/lib/trpc';
import { InsertMessage } from '@/lib/types';
import { queryClient } from '@/providers/query-client-provider';

export const useSendMessageMutation = () => {
  return useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: async (data: InsertMessage) => {
      await trpc.chat.chat.mutate({
        messageId: data.messageId!,
        threadId: data.threadId!,
        content: data.content!,
        model: data.model!,
        role: data.role!,
      });
    },
    onSettled: (data, err, variables) =>
      queryClient.invalidateQueries({ queryKey: ['thread', variables.threadId, 'messages'] }),
  });
};
