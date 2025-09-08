'use client';

import { Fragment } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { useClientStore } from '@/providers/client-store-provider';
import { useApiChats } from '@/hooks/use-api-chats';
import { SpinnerEllipsis } from '../common/spinner';
import { SidebarButton } from './sidebar-button';

export const SidebarChats = () => {
  const currentChatId = useClientStore((store) => store.currentChatId);
  const pendingChatIds = useClientStore((store) =>
    store.chats.filter((chat) => chat.isPending).map((c) => c.chatId)
  );
  const unseenChangesChatIds = useClientStore((store) =>
    store.chats.filter((chat) => chat.unseenChanges).map((c) => c.chatId)
  );

  const chats = useApiChats();

  return (
    <Fragment>
      {chats.map((chat) => (
        <SidebarButton
          key={chat.chatId}
          className={cn(currentChatId === chat.chatId && 'text-foreground-0! bg-foreground-0/5')}
          asChild
        >
          <Link href={`/chat/${chat.chatId}`}>
            <span>{chat.title || 'Thread'}</span>
            {pendingChatIds.includes(chat.chatId) && <SpinnerEllipsis className="ml-auto" size={18} />}
            {unseenChangesChatIds.includes(chat.chatId) && (
              <span className="bg-primary ml-auto size-1 rounded-full"></span>
            )}
          </Link>
        </SidebarButton>
      ))}
    </Fragment>
  );
};
