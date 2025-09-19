'use client';

import { useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { produce } from 'immer';
import { Check, Minus, Plus } from 'lucide-react';
import { useHover } from 'usehooks-ts';

import { api } from '@/infra/convex/_generated/api';
import { Id } from '@/infra/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { Button } from '../common/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../common/tooltip';

type Props = {
  tmdbId: number;
} & React.ComponentProps<'button'>;

export const MovieWatchlistButton = ({ tmdbId, className, ...props }: Props) => {
  const watchlist = useQuery(api.watchlist.getWatchlist, { userId: 'db4ff88c-23e4-4d72-a49b-c29e7e5f5d06' });
  const updateWatchlist = useUpdateWatchlistMutation();

  const isInWatchlist = Boolean(watchlist?.find((item) => item.tmdbId === tmdbId));

  const buttonRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(buttonRef as React.RefObject<HTMLElement>);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipContent>
          {isInWatchlist && 'Remove from watchlist'}
          {!isInWatchlist && 'Add to watchlist'}
        </TooltipContent>
        <TooltipTrigger asChild>
          <Button
            ref={buttonRef}
            variant={'ghost-2'}
            size="icon"
            className={cn('', className)}
            onClick={(e) => {
              e.stopPropagation();
              updateWatchlist({
                tmdbId,
                userId: 'db4ff88c-23e4-4d72-a49b-c29e7e5f5d06',
                data: { watchlist: !isInWatchlist },
              });
            }}
            {...props}
          >
            {isInWatchlist ? (
              <Check className="size-6 text-primary" strokeWidth={2.5} />
            ) : (
              <Plus className="size-6" strokeWidth={2.5} />
            )}
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};

const useUpdateWatchlistMutation = () => {
  return useMutation(api.watchlist.updateWatchlist).withOptimisticUpdate((localState, args) => {
    const localStateWatchlist = localState.getQuery(api.watchlist.getWatchlist, { userId: args.userId });
    if (localStateWatchlist && Array.isArray(localStateWatchlist)) {
      const exists = localStateWatchlist.find((item) => item.tmdbId === args.tmdbId);
      localState.setQuery(
        api.watchlist.getWatchlist,
        { userId: args.userId },
        produce(localStateWatchlist, (draft) => {
          if (exists) {
            const index = draft.indexOf(exists);
            if (args.data.watchlist) {
              draft[index] = { ...exists, ...args.data };
            } else {
              draft.splice(index, 1);
            }
          } else {
            draft.push({
              _id: 'temp-id' as Id<'watchlist'>,
              _creationTime: Date.now(),
              userId: args.userId,
              tmdbId: args.tmdbId,
            });
          }
        })
      );
    }
  });
};
