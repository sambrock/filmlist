import Image from 'next/image';
import Link from 'next/link';
import { preloadedQueryResult, preloadQuery } from 'convex/nextjs';
import { SquarePen } from 'lucide-react';

import { api } from '@/infra/convex/_generated/api';
import { getUserFromAuthTokenCookie } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { SidebarButton } from './sidebar-button';
import { SidebarChats } from './sidebar-chats';
import { SidebarWatchlistButton } from './sidebar-watchlist-button';

type Props = React.ComponentProps<'div'>;

export const Sidebar = async ({ className, ...props }: Props) => {
  const user = await getUserFromAuthTokenCookie();
  console.log('user', user);

  const [preloadedThreadsQuery, preloadedWatchlistQuery] = await Promise.all([
    user ? preloadQuery(api.threads.getByUserId, { userId: user.userId }) : null,
    user ? preloadQuery(api.watchlist.getWatchlist, { userId: user.userId }) : null,
  ]);

  return (
    <div className={cn('border-foreground-0/10 bg-background-0 h-screen border-r p-2', className)} {...props}>
      <div className="hidden p-3 lg:block">
        <Link href="/">
          <Image className="relative z-[999] w-7" src="/logo.svg" alt="Logo" width={28} height={38} />
        </Link>
      </div>

      <div className="mt-16 flex flex-col lg:mt-4">
        <SidebarButton asChild>
          <Link href="/" className="">
            <SquarePen className="mr-2 size-4.5" />
            New chat
          </Link>
        </SidebarButton>

        <SidebarWatchlistButton
          initialWatchlistCount={
            preloadedWatchlistQuery ? preloadedQueryResult(preloadedWatchlistQuery).length : 0
          }
        />
      </div>

      <div className="mt-4">
        <div className="text-foreground-1 px-3 py-1 text-sm">Chats</div>
        <SidebarChats
          initialData={preloadedThreadsQuery ? preloadedQueryResult(preloadedThreadsQuery) : []}
        />
      </div>
    </div>
  );
};
