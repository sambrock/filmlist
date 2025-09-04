'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useClientStore } from '@/providers/client-store-provider';
import { useApiChats } from '@/hooks/use-api-chats';
import { SpinnerEllipsis } from '../common/spinner';
import { SidebarButton } from './sidebar-button';

export const SidebarChats = () => {
  const params = useParams<{ chatId?: string }>();

  const pendingChatIds = useClientStore((store) =>
    store.chats.filter((chat) => chat.isPending).map((c) => c.chatId)
  );

  const chats = useApiChats();

  return (
    <Fragment>
      {chats.map((chat) => (
        <SidebarButton
          key={chat.chatId}
          className={cn(params.chatId === chat.chatId && 'bg-foreground-0/5')}
          asChild
        >
          <Link href={`/chat/${chat.chatId}`}>
            <span>{chat.title || 'Thread'}</span>
            {pendingChatIds.includes(chat.chatId) && <SpinnerEllipsis className="ml-auto" size={18} />}
            {/* {pendingChatIds.includes(chat.chatId) && <SpinnerEllipsis className="ml-auto" />} */}
          </Link>
        </SidebarButton>
      ))}
    </Fragment>
  );
};
