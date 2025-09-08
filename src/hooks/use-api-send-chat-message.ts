import { useParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { produce } from 'immer';

import type { ChatSSE } from '@/app/api/chat/route';
import { trpc } from '@/lib/trpc/client';
import { modelResponseToStructured, readEventStream } from '@/lib/utils/ai';
import { useChatContext } from '@/providers/chat-context-provider';
import { useClientStore } from '@/providers/client-store-provider';
import { useUserContext } from '@/providers/user-context-provider';

export const useApiSendChatMessage = () => {
  const { userId } = useUserContext();
  const { chatId } = useChatContext();

  const { model, isPersisted } = useClientStore((store) => store.chat(chatId)!);
  const dispatch = useClientStore((store) => store.dispatch);

  const params = useParams<{ chatId?: string }>();

  const trpcUtils = trpc.useUtils();

  return useMutation({
    mutationFn: async (content: string) => {
      dispatch({ type: 'CHAT_MESSAGE_PENDING', payload: { chatId } });
      if (params.chatId !== chatId) {
        window.history.pushState({}, '', `/chat/${chatId}`);
      }

      trpcUtils.getChatMessages.setData({ chatId }, (data) => {
        return produce(data, (draft) => {
          if (!draft) draft = { messages: [] };
          draft.messages.unshift({
            messageId: 'temp',
            chatId,
            content,
            model,
            role: 'user',
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log('DONE DRAFT', draft);
        });
      });

      if (!isPersisted) {
        trpcUtils.getChats.setData({ userId }, (state) => {
          return produce(state, (draft) => {
            if (!draft) return;
            draft.unshift({
              chatId,
              userId,
              title: 'New chat',
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          });
        });
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ userId, chatId, model, content }),
      });

      await readEventStream(response, (data) => {
        const parsed = JSON.parse(data) as ChatSSE;

        trpcUtils.getChatMessages.setData({ chatId }, (state) => {
          return produce(state, (draft) => {
            console.log('setting query data', chatId, state);

            if (!draft) return;

            if (parsed.type === 'message' && parsed.v.status === 'pending') {
              if (parsed.v.role === 'user') {
                draft.messages = draft.messages.filter((m) => m.messageId !== 'temp');
                console.log('USER', draft.messages);
              }
              draft.messages.unshift(parsed.v);
            }
            if (parsed.type === 'message' && parsed.v.status === 'done') {
              const message = draft.messages.find((m) => m.messageId === parsed.v.messageId);
              if (message) Object.assign(message, parsed.v);
            }
            if (parsed.type === 'content') {
              const message = draft.messages.find((m) => m.messageId === parsed.id);
              if (message && message.role === 'assistant') {
                message.content += parsed.v;
                message.structured = modelResponseToStructured(message.content);
              }
            }
            console.log('DONE draft', draft);
          });
        });

        if (parsed.type === 'end') {
          dispatch({ type: 'CHAT_MESSAGE_DONE', payload: { chatId } });

          trpcUtils.getUser.refetch();
          trpcUtils.getChats.refetch({ userId });
        }
      });
    },
    retry: false,
  });
};
