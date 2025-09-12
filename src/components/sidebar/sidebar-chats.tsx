'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';

import { api } from '@/infra/convex/_generated/api';
import { Doc } from '@/infra/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { SpinnerEllipsis } from '../common/spinner';
import { SidebarButton } from './sidebar-button';

type Props = {
  initialData: Doc<'threads'>[];
};

export const SidebarChats = ({ initialData }: Props) => {
  const threads =
    useQuery(api.threads.getByUserId, { userId: 'db4ff88c-23e4-4d72-a49b-c29e7e5f5d06' }) || initialData;

  return (
    <Fragment>
      {threads.map((thread) => (
        <SidebarChatButton key={thread.threadId} thread={thread} />
      ))}
    </Fragment>
  );
};

const SidebarChatButton = ({ thread }: { thread: Doc<'threads'> }) => {
  const isActive = useGlobalStore((s) => s.activeThreadId === thread.threadId);
  const isPending = useGlobalStore((s) => s.chatPending.has(thread.threadId));
  const hasUnseenUpdates = useGlobalStore((s) => s.chatUnseenUpdates.has(thread.threadId));

  return (
    <SidebarButton
      key={thread.threadId}
      className={cn(isActive && 'text-foreground-0! bg-foreground-0/5')}
      asChild
    >
      <Link href={`/chat/${thread.threadId}`}>
        <span>{thread.title || 'New chat'}</span>
        {isPending && <SpinnerEllipsis className="ml-auto" size={18} />}
        {hasUnseenUpdates && <span className="bg-primary ml-auto size-1 rounded-full"></span>}
      </Link>
    </SidebarButton>
  );
};
