import { useMutation } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { produce } from 'immer';

import type { ChatSSE } from '@/server/operations/chat';
import {
  useClientStore,
  useClientStoreThreadId,
  useClientStoreUserId,
} from '@/providers/client-store-provider';
import type { Message } from '../../drizzle';
import { trpc } from '../trpc/client';
import { readEventStream } from '../utils';

export const useChatStream = () => {
  const userId = useClientStoreUserId();
  const threadId = useClientStoreThreadId();
  const model = useClientStore((s) => s.model);

  const trpcUtils = trpc.useUtils();

  const threadIdReplaced = threadId.replace('new:', '');

  return useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          threadId,
          userId,
          content,
          model,
        }),
      });

      let pendingMessageAssistant: Message;

      await readEventStream(response, (data) => {
        const parsed = JSON.parse(data) as ChatSSE;
        console.log('parsed', parsed);

        if (parsed.type === 'pending') {
          const message = parsed.v;
          if (message.role === 'assistant') {
            pendingMessageAssistant = message;
          }
          trpcUtils.getThreadMessages.setInfiniteData({ threadId: threadIdReplaced, cursor: 0 }, (state) =>
            produce(state, (draft) => {
              draft!.pages[0].messages.unshift(message);
            })
          );
        }
        if (parsed.type === 'content') {
          trpcUtils.getThreadMessages.setInfiniteData({ threadId: threadIdReplaced, cursor: 0 }, (state) =>
            produce(state, (draft) => {
              const index = draft!.pages[0].messages.findIndex(
                (m) => m.messageId === pendingMessageAssistant.messageId
              );
              if (index !== -1) {
                const message = draft!.pages[0].messages[index];
                message.content += parsed.v;
              }
            })
          );
        }
        if (parsed.type === 'done') {
          const message = parsed.v;
          trpcUtils.getThreadMessages.setInfiniteData({ threadId: threadIdReplaced, cursor: 0 }, (state) =>
            produce(state, (draft) => {
              const index = draft!.pages[0].messages.findIndex((m) => m.messageId === message.messageId);
              if (index !== -1) {
                Object.assign(draft!.pages[0].messages[index], message);
              }
            })
          );
        }
        if (parsed.type === 'movie') {
          const movie = parsed.v;
          trpcUtils.getThreadMessages.setInfiniteData({ threadId: threadIdReplaced, cursor: 0 }, (state) =>
            produce(state, (draft) => {
              const index = draft!.pages[0].messages.findIndex(
                (m) => m.messageId === pendingMessageAssistant.messageId
              );
              if (index !== -1) {
                const message = draft!.pages[0].messages[index];
                if (message.movies === undefined) {
                  message.movies = [];
                }
                draft!.pages[0].messages[index].movies.push(movie);
              }
            })
          );
        }
        if (parsed.type === 'end') {
          trpcUtils.invalidate(undefined, {
            queryKey: getQueryKey(trpc.getThreadMessages, { threadId: threadIdReplaced }),
          });
        }
      });
    },
    retry: false,
  });
};
