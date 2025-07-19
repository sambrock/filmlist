import { useMutation } from '@tanstack/react-query';

import type { ChatSSEData } from '@/app/api/chat/route';
import {
  useChatActions,
  useChatInputValue,
  useChatModel,
  useChatThreadId,
} from '@/providers/chat-store-provider';
import { readEventStream } from '../utils';

export const useSendMessage = () => {
  const threadId = useChatThreadId();
  const content = useChatInputValue();
  const model = useChatModel();
  const { processChatSSE } = useChatActions();

  return useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: async () => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ threadId, content, model }),
      });

      await readEventStream(response, (data) => {
        const parsed = JSON.parse(data) as ChatSSEData;
        processChatSSE(parsed);
      });
    },
    retry: false,
  });
};
