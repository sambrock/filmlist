'use client';

import { useMovieActivityStore } from '@/providers/MovieActivityStoreProvider';

export const MovieActionWatchlistButton = () => {
  const watchlist = useMovieActivityStore((s) => s.watchlist);
  const dispatch = useMovieActivityStore((s) => s.dispatch);

  const handleClick = () => {
    dispatch({ type: 'TOGGLE_WATCHLIST' });
  };

  // return (
  //   <MovieActionButton
  //     className={cn('bg-text-default/10')}
  //     icon={
  //       <Icon
  //         name="plus"
  //         className={cn('h-icon-sm w-icon-sm', watchlist ? 'stroke-blue-default' : 'stroke-text-subtle/70')}
  //       />
  //     }
  //     text="Watchlist"
  //     onClick={handleClick}
  //   />
  // );
};
