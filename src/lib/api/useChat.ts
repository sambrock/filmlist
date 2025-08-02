import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import type { ChatSSEData } from '@/app/api/chat/route';
import { Message, MessageAssistant, MessageUser } from '../drizzle';
import { readEventStream } from '../utils';

export const useChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ threadId: undefined, userId: undefined, content, model: 'gpt-4o' }),
      });

      // await readEventStream(response, (data) => {
      //   const parsed = JSON.parse(data) as ChatSSEData;

      //   if (parsed.type === 'message') {
      //     queryClientAddMessage(queryClient, threadId, parsed.v);
      //   }
      //   if (parsed.type === 'content') {
      //     queryClientUpdateMessageContent(queryClient, threadId, parsed.id, parsed.v);
      //   }
      //   if (parsed.type === 'final') {
      //     queryClientReplaceMessage(queryClient, threadId, parsed.v);
      //   }
      //   if (parsed.type === 'end') {
      //     queryClient.invalidateQueries({
      //       queryKey: [threadId, 'messages'],
      //     });
      //   }
      // });
    },
    retry: false,
  });
};

const queryClientAddMessage = (queryClient: QueryClient, threadId: string, message: Message) => {
  queryClient.setQueryData(
    [threadId, 'messages'],
    (state: { pages: { messages: (Message | MessageUser | MessageAssistant)[] }[] }) => {
      if (!state) return state;

      return produce(state, (draft) => {
        draft.pages[0].messages.unshift(message);
      });
    }
  );
};

const queryClientUpdateMessageContent = (
  queryClient: QueryClient,
  threadId: string,
  messageId: string,
  content: string
) => {
  queryClient.setQueryData(
    [threadId, 'messages'],
    (state: { pages: { messages: (Message | MessageUser | MessageAssistant)[] }[] }) => {
      if (!state) return state;

      return produce(state, (draft) => {
        const index = draft.pages[0].messages.findIndex((message) => message.messageId === messageId);
        if (index !== -1) {
          const message = draft.pages[0].messages[index];
          draft.pages[0].messages[index] = { ...message, content: (message.content += content) };
        }
      });
    }
  );
};

const queryClientReplaceMessage = (queryClient: QueryClient, threadId: string, message: Message) => {
  queryClient.setQueryData(
    [threadId, 'messages'],
    (state: { pages: { messages: (Message | MessageUser | MessageAssistant)[] }[] }) => {
      if (!state) return state;

      return produce(state, (draft) => {
        const index = draft.pages[0].messages.findIndex((msg) => msg.messageId === message.messageId);
        if (index !== -1) {
          draft.pages[0].messages[index] = message;
        } else {
          draft.pages[0].messages.unshift(message);
        }
      });
    }
  );
};
