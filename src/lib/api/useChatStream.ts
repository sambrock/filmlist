import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import type { ChatSSEData } from '@/app/api/chat/route';
import { useClientStore } from '@/providers/client-store-provider';
import { useThreadContext } from '@/providers/thread-context-provider';
import { useUserContext } from '@/providers/user-context-provider';
import type { Message, MessageAssistant } from '../drizzle';
import { readEventStream } from '../utils';

export const useChatStream = () => {
  const queryClient = useQueryClient();

  const { user } = useUserContext();
  const { threadId } = useThreadContext();
  const model = useClientStore((s) => s.model);

  return useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          threadId,
          userId: user.userId,
          content,
          model,
        }),
      });

      let pendingMessageAssistant: Message;

      await readEventStream(response, (data) => {
        const parsed = JSON.parse(data) as ChatSSEData;

        if (parsed.type === 'pending') {
          const message = parsed.v;
          if (message.role === 'assistant') {
            pendingMessageAssistant = message;
          }
          queryClient.setQueryData(
            ['thread', threadId, 'messages'],
            (state: InfiniteData<{ messages: Message[] }>) =>
              produce(state, (draft) => {
                if (!draft) {
                  draft = { pages: [{ messages: [] }], pageParams: [] };
                }
                draft.pages[0].messages.unshift(message);
              })
          );
        }
        if (parsed.type === 'content') {
          queryClient.setQueryData(
            ['thread', threadId, 'messages'],
            (state: InfiniteData<{ messages: Message[] }>) =>
              produce(state, (draft) => {
                const index = draft.pages[0].messages.findIndex(
                  (m) => m.messageId === pendingMessageAssistant.messageId
                );
                if (index !== -1) {
                  draft.pages[0].messages[index].content += parsed.v;
                }
              })
          );
        }
        if (parsed.type === 'done') {
          const message = parsed.v;
          queryClient.setQueryData(
            ['thread', threadId, 'messages'],
            (state: InfiniteData<{ messages: Message[] }>) =>
              produce(state, (draft) => {
                const index = draft.pages[0].messages.findIndex((m) => m.messageId === message.messageId);
                if (index !== -1) {
                  Object.assign(draft.pages[0].messages[index], message);
                }
              })
          );
        }
        if (parsed.type === 'movie') {
          const movie = parsed.v;
          queryClient.setQueryData(
            ['thread', threadId, 'messages'],
            (state: InfiniteData<{ messages: MessageAssistant[] }>) =>
              produce(state, (draft) => {
                const index = draft.pages[0].messages.findIndex(
                  (m) => m.messageId === pendingMessageAssistant.messageId
                );
                if (index !== -1) {
                  const message = draft.pages[0].messages[index] as MessageAssistant;
                  if (message.movies === undefined) {
                    message.movies = [];
                  }
                  draft.pages[0].messages[index].movies.push(movie);
                }
              })
          );
        }
        if (parsed.type === 'end') {
          // router.push(`/${threadId}`);
        }
      });
    },
    retry: false,
  });
};
