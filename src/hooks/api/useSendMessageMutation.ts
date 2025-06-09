import { useMutation } from '@tanstack/react-query';

import { trpc } from '@/lib/trpc';
import { ChatMessage } from '@/lib/types';
import { useChatStore } from '@/providers/chat-store-provider';

export const useSendMessageMutation = () => {
  const setMessage = useChatStore((state) => state.setMessage);

  return useMutation({
    mutationKey: ['sendMessage'],
    retry: false,
    mutationFn: async (userMessage: ChatMessage) => {
      setMessage(userMessage.messageId, userMessage);

      trpc.chat.subscribe(userMessage, {
        onData: (assistantMessage: string) => {
          const parsed = JSON.parse(assistantMessage) as ChatMessage;
          console.log(assistantMessage);
          setMessage(parsed.messageId, parsed);
        },
        onComplete: () => {},
        onStopped: () => {},
      });
    },
  });
};

// export const usePendingMessages = () => {
//   return useMutationState<Message>({
//     filters: { mutationKey: ['sendMessage'], status: 'pending' },
//     select: (mutation) => mutation.state.variables as Message,
//   });
// };

// export const usePendingMessageResponse = () => {
//   return useQuery({
//     queryKey: ['response'],
//     queryFn: () => {
//       const responseData = queryClient.getQueryData(['response']) as string;
//       return responseData || '';
//     },
//     initialData: '',
//     refetchOnWindowFocus: false,
//   });
// };
