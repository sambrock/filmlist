'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';
import { ListVideo } from 'lucide-react';

import { api } from '@/infra/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useUserContext } from '@/providers/use-context-provider';
import { SidebarButton } from './sidebar-button';

type Props = {
  initialWatchlistCount: number;
};

export const SidebarWatchlistButton = ({ initialWatchlistCount }: Props) => {
  const { userId } = useUserContext();

  const dispatch = useGlobalStore((s) => s.dispatch);
  const watchlist = useQuery(api.watchlist.getWatchlist, { userId });
  const pathname = usePathname();

  const watchlistCount = watchlist ? watchlist.length : initialWatchlistCount;

  useEffect(() => {
    dispatch({ type: 'SET_ACTIVE_THREAD_ID', payload: { threadId: '' } });
  }, [pathname]);

  return (
    <SidebarButton className={cn(pathname.includes('watchlist') && 'bg-foreground-0/5')} asChild>
      <Link href="/watchlist">
        <ListVideo className="mr-2 size-4.5" />
        Watchlist
        {watchlistCount > 0 && (
          <span className="text-primary ml-auto text-xs font-medium">{watchlistCount}</span>
        )}
      </Link>
    </SidebarButton>
  );
};
