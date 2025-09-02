import { useMutation } from '@tanstack/react-query';
import { produce } from 'immer';

import type { ChatSSE } from '@/app/api/chat/route';
import { trpc } from '@/lib/trpc/client';
import { modelResponseToStructured, readEventStream } from '@/lib/utils/ai';
import { clearUuid } from '@/lib/utils/uuid';
import { useChatContext } from '@/providers/chat-context-provider';
import { useChatStore } from '@/providers/chat-store-provider';
import { useUserContext } from '@/providers/user-context-provider';

export const useSendChatMessage = () => {
  const { userId } = useUserContext();
  const { chatId } = useChatContext();
  const [{ model, isPersisted }, updateChat] = useChatStore((store) => [
    store.actions.getChat(chatId),
    store.actions.updateChat,
  ]);

  const trpcUtils = trpc.useUtils();

  return useMutation({
    mutationFn: async (content: string) => {
      updateChat(chatId, { isPending: true });

      trpcUtils.getChatMessages.setInfiniteData({ chatId: clearUuid(chatId) }, (state) => {
        return produce(state, (draft) => {
          console.log('DRAFT', draft);
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
        body: JSON.stringify({
          userId,
          chatId: isPersisted ? chatId : `unsaved:${chatId}`,
          model,
          content,
        }),
      });

      await readEventStream(response, (data) => {
        const parsed = JSON.parse(data) as ChatSSE;

        trpcUtils.getChatMessages.setInfiniteData({ chatId: clearUuid(chatId) }, (state) => {
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
          trpcUtils.getUser.invalidate();
          trpcUtils.getChats.refetch({ userId });

          updateChat(chatId, { chatId: clearUuid(chatId), isPending: false });
        }
      });
    },
    retry: false,
  });
};
