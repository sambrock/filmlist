import { useMutation } from '@tanstack/react-query';
import { produce } from 'immer';

import type { ChatSSE } from '@/app/api/chat/route';
import type { ChatMessage } from '@/lib/drizzle/types';
import { trpc } from '@/lib/trpc/client';
import { parseMoviesFromOutputStream, readEventStream } from '@/lib/utils/ai';
import { clearUuid } from '@/lib/utils/uuid';
import { useChatStore } from '@/providers/chat-store-provider';
import { useGlobalStore } from '@/providers/global-store-provider';

export const useChatMutation = () => {
  const [userId, setUserId] = useGlobalStore((store) => [store.userId, store.actions.setUserId]);
  const [threadId, model, setThreadId] = useChatStore((store) => [
    store.threadId,
    store.model,
    store.actions.setThreadId,
  ]);

  const trpcUtils = trpc.useUtils();

  return useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ userId, threadId, model, content }),
      });

      // Optimistically update with user message
      trpcUtils.getChatMessages.setInfiniteData({ threadId: clearUuid(threadId) }, (state) =>
        produce(state, (draft) => {
          draft!.pages[0].messages.unshift({
            user: { messageId: '', content },
            assistant: { messageId: '', model },
            movies: [],
          } as unknown as ChatMessage);
        })
      );

      await readEventStream(response, (data) => {
        const parsed = JSON.parse(data) as ChatSSE;

        if (parsed.type === 'user') {
          setUserId(parsed.v);
        }
        if (parsed.type === 'thread') {
          setThreadId(parsed.v);
        }

        if (parsed.type === 'message') {
          trpcUtils.getChatMessages.setInfiniteData({ threadId: clearUuid(threadId) }, (state) =>
            produce(state, (draft) => {
              const chatMessage = draft!.pages[0].messages[0];
              if (parsed.v.role === 'user') {
                Object.assign(chatMessage.user, parsed.v);
              }
              if (parsed.v.role === 'assistant') {
                Object.assign(chatMessage.assistant, parsed.v);
              }
            })
          );
        }
        if (parsed.type === 'content') {
          trpcUtils.getChatMessages.setInfiniteData({ threadId: clearUuid(threadId) }, (state) =>
            produce(state, (draft) => {
              const chatMessage = draft!.pages[0].messages[0];
              chatMessage.assistant.content += parsed.v;
              chatMessage.assistant.structured = parseMoviesFromOutputStream(chatMessage.assistant.content);
            })
          );
        }
        if (parsed.type === 'movie') {
          trpcUtils.getChatMessages.setInfiniteData({ threadId: clearUuid(threadId) }, (state) =>
            produce(state, (draft) => {
              const chatMessage = draft!.pages[0].messages[0];
              chatMessage.movies.push(parsed.v);
            })
          );
        }
      });
    },
    retry: false,
  });
};
