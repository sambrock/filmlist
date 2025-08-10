import { useMutation } from '@tanstack/react-query';
import { produce } from 'immer';

import type { ChatSSE } from '@/app/api/chat/route';
import { Message } from '@/lib/drizzle/types';
import { trpc } from '@/lib/trpc/client';
import { readEventStream } from '@/lib/utils/ai';
import { clearUuid } from '@/lib/utils/uuid';
import { useChatStore } from '@/providers/chat-store-provider';
import { useGlobalStore } from '@/providers/global-store-provider';

export const useChatStream = () => {
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

      let messageAssistant: Message;

      await readEventStream(response, (data) => {
        const parsed = JSON.parse(data) as ChatSSE;
        console.log('parsed', parsed);

        if (parsed.type === 'user') {
          setUserId(parsed.v);
        }
        if (parsed.type === 'thread') {
          setThreadId(parsed.v);
        }

        if (parsed.type === 'message') {
          const message = parsed.v;
          if (message.role === 'assistant') {
            messageAssistant = message;
          }
          trpcUtils.getThreadMessages.setInfiniteData({ threadId: clearUuid(threadId) }, (state) =>
            produce(state, (draft) => {
              const messages = draft!.pages[0].messages;
              if (messages.find((m) => m.messageId === message.messageId)) {
                const index = messages.findIndex((m) => m.messageId === message.messageId);
                // @ts-expect-error: todo
                messages[index] = message;
              } else {
                // @ts-expect-error: todo
                messages.unshift(message);
              }
            })
          );
        }
        if (parsed.type === 'content') {
          trpcUtils.getThreadMessages.setInfiniteData({ threadId: clearUuid(threadId) }, (state) =>
            produce(state, (draft) => {
              const index = draft!.pages[0].messages.findIndex(
                (m) => m.messageId === messageAssistant.messageId
              );
              if (index !== -1) {
                const message = draft!.pages[0].messages[index];
                message.content += parsed.v;
              }
            })
          );
        }
        if (parsed.type === 'movie') {
          const movie = parsed.v;
          trpcUtils.getThreadMessages.setInfiniteData({ threadId: clearUuid(threadId) }, (state) =>
            produce(state, (draft) => {
              const index = draft!.pages[0].messages.findIndex(
                (m) => m.messageId === messageAssistant.messageId
              );
              if (index !== -1) {
                const message = draft!.pages[0].messages[index];
                if (message.movies === undefined) {
                  message.movies = [];
                }
                // @ts-expect-error: todo
                draft!.pages[0].messages[index].movies.push(movie);
              }
            })
          );
        }
        // if (parsed.type === 'end') {
        //   trpcUtils.invalidate(undefined, {
        //     queryKey: getQueryKey(trpc.getThreadMessages, { threadId: clearUuid(threadId) }),
        //   });
        // }
      });
    },
    retry: false,
  });
};
