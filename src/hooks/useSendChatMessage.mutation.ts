import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { ChatEventStreamData, readChatEventStream } from '@/lib/utils/chat.utils';
import {
  useChatActions,
  useChatInputValue,
  useChatModel,
  useChatThreadId,
} from '@/providers/chat-store-provider';

export const useSendMessageMutation = () => {
  const threadId = useChatThreadId();
  const content = useChatInputValue();
  const model = useChatModel();
  const { ingestChatStream } = useChatActions();

  return useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: async (key: string) => {
      const { response } = await api.POST('/api/chat', {
        body: { threadId, content, model },
        parseAs: 'stream',
      });

      await readChatEventStream(response, (data) => {
        const parsed = JSON.parse(data) as ChatEventStreamData;
        ingestChatStream(key, parsed);
      });
    },
    retry: false,
  });
};
