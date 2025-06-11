import { useMutation } from '@tanstack/react-query';

import { trpc } from '@/lib/trpc';
import { ChatMessage } from '@/lib/types';
import { useChatStore } from '@/providers/chat-store-provider';

export const useSendMessageMutation = () => {
  const [threadExists, threadId] = useChatStore((state) => [state.threadExists, state.threadId]);
  const setMessage = useChatStore((state) => state.setMessage);

  return useMutation({
    mutationKey: ['sendMessage'],
    retry: false,
    mutationFn: async (userMessage: ChatMessage) => {
      console.log('threadExists', threadExists);
      if (!threadExists) {
        await trpc.initThread.mutate({ threadId });
      }

      setMessage(userMessage.messageId, userMessage);

      trpc.chat.subscribe(userMessage, {
        onData: (assistantMessage: string) => {
          const parsed = JSON.parse(assistantMessage) as ChatMessage;
          setMessage(parsed.messageId, parsed);
        },
        onComplete: () => {},
        onStopped: () => {},
      });
    },
  });
};
