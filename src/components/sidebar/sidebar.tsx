import Image from 'next/image';
import Link from 'next/link';
import { preloadedQueryResult, preloadQuery } from 'convex/nextjs';
import { SquarePen } from 'lucide-react';

import { api } from '@/infra/convex/_generated/api';
import { cn } from '@/lib/utils';
import { SidebarButton } from './sidebar-button';
import { SidebarChats } from './sidebar-chats';
import { SidebarWatchlistButton } from './sidebar-watchlist-button';

type Props = React.ComponentProps<'div'>;

export const Sidebar = async ({ className, ...props }: Props) => {
  const [preloadedThreadsQuery, preloadedWatchlistQuery] = await Promise.all([
    preloadQuery(api.threads.getByUserId, {
      userId: 'db4ff88c-23e4-4d72-a49b-c29e7e5f5d06',
    }),
    preloadQuery(api.watchlist.getWatchlist, {
      userId: 'db4ff88c-23e4-4d72-a49b-c29e7e5f5d06',
    }),
  ]);

  return (
    <div className={cn('border-foreground-0/10 bg-background-0 h-screen border-r p-2', className)} {...props}>
      <div className="hidden lg:block p-3 ">
        <Link href="/">
          <Image className="relative z-[999] w-7" src="/logo.svg" alt="Logo" width={28} height={38} />
        </Link>
      </div>

      <div className="mt-16 lg:mt-4 flex flex-col ">
        <SidebarButton asChild>
          <Link href="/" className="">
            <SquarePen className="mr-2 size-4.5" />
            New chat
          </Link>
        </SidebarButton>

        <SidebarWatchlistButton
          initialWatchlistCount={preloadedQueryResult(preloadedWatchlistQuery).length}
        />
      </div>

      <div className="mt-4">
        <div className="text-foreground-1 px-3 py-1 text-sm">Chats</div>
        <SidebarChats initialData={preloadedQueryResult(preloadedThreadsQuery)} />
      </div>
    </div>
  );
};
