import { useMutation } from '@tanstack/react-query';
import { produce } from 'immer';

import type { ChatSSE } from '@/app/api/chat/route';
import { trpc } from '@/lib/trpc/client';
import { modelResponseToStructured, readEventStream } from '@/lib/utils/ai';
import { useChatContext } from '@/providers/chat-context-provider';
import { useClientStore } from '@/providers/client-store-provider';
import { useUserContext } from '@/providers/user-context-provider';

export const useSendChatMessage = () => {
  const { userId } = useUserContext();
  const { chatId } = useChatContext();

  const { model } = useClientStore((store) => store.chat(chatId)!);
  const dispatch = useClientStore((store) => store.dispatch);

  const trpcUtils = trpc.useUtils();

  return useMutation({
    mutationFn: async (content: string) => {
      dispatch({ type: 'CHAT_MESSAGE_PENDING', payload: { chatId } });
      window.history.pushState({}, '', `/chat/${chatId}`);

      trpcUtils.getChatMessages.setInfiniteData({ chatId }, (state) => {
        return produce(state, (draft) => {
          if (!draft) return;
          draft.pages[0].messages.unshift({
            messageId: 'temp',
            chatId,
            content,
            model,
            role: 'user',
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ userId, chatId, model, content }),
      });

      await readEventStream(response, (data) => {
        const parsed = JSON.parse(data) as ChatSSE;

        trpcUtils.getChatMessages.setInfiniteData({ chatId }, (state) => {
          return produce(state, (draft) => {
            if (!draft) return;
            if (parsed.type === 'message' && parsed.v.status === 'pending') {
              if (parsed.v.role === 'user') {
                draft.pages[0].messages = draft.pages[0].messages.filter((m) => m.messageId !== 'temp');
              }
              draft.pages[0].messages.unshift(parsed.v);
            }
            if (parsed.type === 'message' && parsed.v.status === 'done') {
              const message = draft.pages[0].messages.find((m) => m.messageId === parsed.v.messageId);
              if (message) Object.assign(message, parsed.v);
            }
            if (parsed.type === 'content') {
              const message = draft.pages[0].messages.find((m) => m.messageId === parsed.id);
              if (message && message.role === 'assistant') {
                message.content += parsed.v;
                message.structured = modelResponseToStructured(message.content);
              }
            }
          });
        });
        if (parsed.type === 'end') {
          dispatch({ type: 'CHAT_MESSAGE_DONE', payload: { chatId } });
          trpcUtils.getUser.invalidate();
          trpcUtils.getChats.refetch({ userId });
        }
      });
    },
    retry: false,
  });
};
