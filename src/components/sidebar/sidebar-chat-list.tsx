'use client';

import Link from 'next/link';

import { trpc } from '@/lib/trpc/client';
import { useChatStore } from '@/providers/chat-store-provider';
import { useUserContext } from '@/providers/user-context-provider';
import { Spinner } from '../common/spinner';

export const SidebarChatList = () => {
  const { userId } = useUserContext();
  const pendingChatIds = useChatStore((store) =>
    store.chats.filter((chat) => chat.isPending).map((c) => c.chatId)
  );

  const chatsQuery = trpc.getChats.useQuery({ userId }, { enabled: Boolean(userId) });

  return (
    <div>
      {chatsQuery.data?.map((chat) => (
        <Link href={`/chat/${chat.chatId}`} key={chat.chatId}>
          <div className="hover:bg-foreground-0/10 flex w-full items-center justify-between px-2 py-1 text-sm">
            <span>{chat.title || 'Thread'}</span>
            {pendingChatIds.includes(chat.chatId) && <Spinner width={20} className="ml-auto" />}
          </div>
        </Link>
      ))}
    </div>
  );
};
