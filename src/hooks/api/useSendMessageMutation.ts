import { useMutation, useMutationState, useQuery } from '@tanstack/react-query';

import { trpc } from '@/lib/trpc';
import { ChatInput } from '@/lib/trpc/procedures/chat.procedure';
import { Message } from '@/lib/types';
import { queryClient } from '@/providers/query-client-provider';

export const useSendMessageMutation = () => {
  return useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: async (data: ChatInput) => {
      trpc.chat.subscribe(data, {
        onData: (message) => {
          const responseData = queryClient.getQueryData(['response']) as string;
          queryClient.setQueryData(['response'], responseData.concat(message));
        },
        onComplete: () => {
          queryClient.invalidateQueries({ queryKey: ['thread', data.threadId, 'messages'] });
        },
      });
    },
  });
};

export const usePendingMessage = () => {
  return useMutationState<Message>({
    filters: { mutationKey: ['sendMessage'], status: 'success' },
    select: (mutation) => mutation.state.variables as Message,
  });
};

export const usePendingMessageResponse = () => {
  return useQuery({
    queryKey: ['response'],
    queryFn: () => {
      const responseData = queryClient.getQueryData(['response']) as string;
      return responseData || '';
    },
    initialData: '',
    refetchOnWindowFocus: false,
  });
};
