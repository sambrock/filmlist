'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { ListVideo } from 'lucide-react';

import { api } from '@/infra/convex/_generated/api';
import { SidebarButton } from './sidebar-button';

type Props = {
  initialWatchlistCount: number;
};

export const SidebarWatchlistButton = ({ initialWatchlistCount }: Props) => {
  const watchlist = useQuery(api.watchlist.getWatchlist, {
    userId: 'db4ff88c-23e4-4d72-a49b-c29e7e5f5d06',
  });

  const watchlistCount = watchlist ? watchlist.length : initialWatchlistCount;

  return (
    <SidebarButton asChild>
      <Link href="/">
        <ListVideo className="mr-2 size-4.5" />
        Watchlist
        {watchlistCount > 0 && (
          <span className="bg-background-0 text-primary ml-auto inline-flex h-4 items-center rounded px-1.5 text-xs font-medium">
            {watchlistCount}
          </span>
        )}
      </Link>
    </SidebarButton>
  );
};
