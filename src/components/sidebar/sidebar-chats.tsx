'use client';

import { Fragment, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';

import { api } from '@/infra/convex/_generated/api';
import { Doc } from '@/infra/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { Button } from '../common/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../common/dropdown';
import { SpinnerEllipsis } from '../common/spinner';

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
  const [editing, setEditing] = useState(false);

  const isActive = useGlobalStore((s) => s.activeThreadId === thread.threadId);
  const isPending = useGlobalStore((s) => s.chatPending.has(thread.threadId));
  const hasUnseenUpdates = useGlobalStore((s) => s.chatUnseenUpdates.has(thread.threadId));

  const updateMutation = useMutation(api.threads.update);

  const threadTitleRef = useRef<HTMLDivElement>(null);

  const enableRename = () => {
    setEditing(true);
    requestAnimationFrame(() => threadTitleRef.current?.focus());
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateMutation({
        threadId: thread.threadId,
        data: {
          title: threadTitleRef.current?.innerText || '',
        },
      });
      setEditing(false);
      threadTitleRef.current?.blur();
      return;
    }
    if (e.key === 'Escape') {
      setEditing(false);
      threadTitleRef.current!.innerText = thread.title;
      threadTitleRef.current?.blur();
      return;
    }
  };

  const handleTitleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (editing) {
      e.preventDefault();

      // Select text
      const range = document.createRange();
      range.selectNodeContents(threadTitleRef.current!);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Remove select
    const sel = window.getSelection();
    sel?.removeAllRanges();

    if (editing) {
      updateMutation({
        threadId: thread.threadId,
        data: { title: threadTitleRef.current?.innerText || '' },
      });
      setEditing(false);
    }
  };

  return (
    <div
      key={thread.threadId}
      className={cn(
        'group hover:bg-foreground-0/5 text-foreground-2 focus-within:text-foreground-0 hover:text-foreground-0 relative flex h-9 cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap',
        isActive && 'group text-foreground-0! bg-foreground-0/5'
      )}
    >
      <Link
        href={`/chat/${thread.threadId}`}
        className="focus-visible:ring-ring left-0 flex h-8 w-full items-center rounded-sm font-medium whitespace-nowrap transition select-none focus:outline-none focus-visible:ring-2"
      >
        <div
          ref={threadTitleRef}
          className="focus-visible:ring-ring w-full overflow-hidden rounded-sm overflow-ellipsis whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:outline-none"
          onKeyDown={handleTitleKeyDown}
          onFocus={handleTitleFocus}
          onBlur={handleTitleBlur}
          contentEditable={editing}
          suppressContentEditableWarning
        >
          {thread.title || 'New chat'}
        </div>

        {isPending && (
          <SpinnerEllipsis
            className="absolute top-1/2 right-3 -translate-y-1/2 self-center group-hover:hidden"
            size={18}
          />
        )}
        {hasUnseenUpdates && (
          <span className="bg-primary ml-auto size-1 rounded-full group-hover:hidden"></span>
        )}
      </Link>
      {!editing && <SidebarThreadMenu threadId={thread.threadId} enableRename={enableRename} />}
    </div>
  );
};

const SidebarThreadMenu = ({ threadId, enableRename }: { threadId: string; enableRename: () => void }) => {
  const activeThreadId = useGlobalStore((s) => s.activeThreadId);

  const removeMutation = useMutation(api.threads.remove);
  const router = useRouter();

  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <Button
          className="invisible -mr-2 ml-auto text-sm group-focus-within:visible group-hover:visible"
          size="sm"
          variant="transparent"
        >
          <Ellipsis className="size-5" />
        </Button>
      </DropdownTrigger>

      <DropdownContent className="w-32 origin-top-left" align="start" side="bottom" sideOffset={2}>
        <DropdownItem
          className=""
          onClick={(e) => {
            e.stopPropagation();
            enableRename();
          }}
        >
          <div className="flex items-center gap-3">
            <Pencil className="size-4" />
            <span className="text-sm font-medium">Rename</span>
          </div>
        </DropdownItem>
        <DropdownItem
          className=""
          onClick={async () => {
            await removeMutation({ threadId });
            if (activeThreadId === threadId) {
              router.push('/');
            }
          }}
        >
          <div className="flex items-center gap-3">
            <Trash2 className="size-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Delete</span>
          </div>
        </DropdownItem>
      </DropdownContent>
    </DropdownRoot>
  );
};
