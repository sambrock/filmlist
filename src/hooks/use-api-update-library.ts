import { produce } from 'immer';

import { trpc } from '@/lib/trpc/client';
import { useChatContext } from '@/providers/chat-context-provider';
import { useMessageContext } from '@/providers/message-context-provider';

export const useApiUpdateLibrary = () => {
  const { chatId } = useChatContext();
  const { messageId } = useMessageContext();

  const trpcUtils = trpc.useUtils();

  return trpc.updateLibrary.useMutation({
    onMutate: (input) => {
      trpcUtils.getChatMessages.setInfiniteData({ chatId }, (data) => {
        return produce(data, (draft) => {
          if (!draft) return;
          const message = draft.pages.flatMap((p) => p.messages).find((m) => m.messageId === messageId);
          if (!message || message.role === 'user') return;
          const movie = message.movies.find((m) => m.movieId === input.movieId);
          if (!movie) return;
          movie.liked = input.liked ?? movie.liked;
          movie.watched = input.watched ?? movie.watched;
          movie.watchlist = input.watchlist ?? movie.watchlist;
        });
      });
    },
  });
};
