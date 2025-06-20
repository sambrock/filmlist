import { useMutation } from '@tanstack/react-query';

import type { EventStreamData } from '@/server/routes/chat';
import { api } from '@/lib/api/client';
import { readEventStream } from '@/lib/utils/sse';
import { useChatStore } from '@/providers/chat-store-provider';

export const useSendMessageMutation = () => {
  const storeActions = useChatStore((state) => state.actions);
  const threadId = useChatStore((state) => state.threadId);
  const model = useChatStore((state) => state.model);
  const content = useChatStore((state) => state.inputValue);

  return useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: async () => {
      const { response } = await api.POST('/api/chat', {
        body: {
          threadId,
          content,
          model,
        },
        parseAs: 'stream',
      });

      await readEventStream(response, (data) => {
        const parsed = JSON.parse(data) as EventStreamData;

        if (parsed.type === 'message') {
          storeActions.setMessage(parsed.v.messageId, parsed.v);
        }
        if (parsed.type === 'content') {
          storeActions.appendMessageContent(parsed.id, parsed.v);
        }
        if (parsed.type === 'movie') {
          storeActions.addMessageMovies(parsed.id, parsed.v);
        }
        if (parsed.type === 'end') {
          console.log('Stream ended');
        }
      });
    },
    retry: false,
  });
};
