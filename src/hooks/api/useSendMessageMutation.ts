import { useMutation } from '@tanstack/react-query';

import { ContentData, FinalContentData } from '@/server/routes/chat';
import { api } from '@/lib/api/client';
import { ChatMessage } from '@/lib/types';
import { readEventStream } from '@/lib/utils/sse';
import { useChatStore } from '@/providers/chat-store-provider';

export const useSendMessageMutation = () => {
  const setMessage = useChatStore((state) => state.setMessage);

  return useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: async (userMessage: ChatMessage) => {
      setMessage(userMessage.messageId, userMessage);

      const { response } = await api.POST('/api/chat', {
        body: {
          content: userMessage.content,
          threadId: userMessage.threadId,
          messageId: userMessage.messageId,
          model: userMessage.model,
        },
        parseAs: 'stream',
      });

      await readEventStream(response, {
        content: (data) => {
          const parsed = JSON.parse(data) as ContentData;
          console.log('content:', parsed);
        },
        finalContent: (data) => {
          const parsed = JSON.parse(data) as FinalContentData;
          console.log('finalContent:', parsed);
        },
      });
    },
    retry: false,
  });
};
