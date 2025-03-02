'use client';

import { cn } from '@/lib/utils/cn';
import { useMovieActivityStore } from '@/providers/MovieActivityStoreProvider';
import { Icon } from '../common/Icon';

export const MovieActionWatchButton = () => {
  const watched = useMovieActivityStore((s) => s.watched);
  const dispatch = useMovieActivityStore((s) => s.dispatch);

  const handleClick = () => {
    dispatch({ type: 'TOGGLE_WATCH' });
  };

  return (
    <MovieActionButton
      className={cn(watched ? 'bg-green-default/30' : 'bg-text-default/10')}
      icon={
        <Icon
          name="eye"
          className={cn('h-icon-sm w-icon-sm', watched ? 'stroke-green-default' : 'stroke-text-subtle/70')}
        />
      }
      text={watched ? 'Watched' : 'Watch'}
      onClick={handleClick}
    />
  );
};

export const MovieActionLikeButton = () => {
  const liked = useMovieActivityStore((s) => s.liked);
  const dispatch = useMovieActivityStore((s) => s.dispatch);

  const handleClick = () => {
    dispatch({ type: 'TOGGLE_LIKE' });
  };

  return (
    <MovieActionButton
      className={cn(liked ? 'bg-orange-default/30' : 'bg-text-default/10')}
      icon={
        <Icon
          name="heart"
          className={cn('h-icon-sm w-icon-sm', liked ? 'stroke-orange-default' : 'stroke-text-subtle/70')}
        />
      }
      text={liked ? 'Liked' : 'Like'}
      onClick={handleClick}
    />
  );
};

export const MovieActionWatchlistButton = () => {
  const watchlist = useMovieActivityStore((s) => s.watchlist);
  const dispatch = useMovieActivityStore((s) => s.dispatch);

  const handleClick = () => {
    dispatch({ type: 'TOGGLE_WATCHLIST' });
  };

  return (
    <MovieActionButton
      className={cn('bg-text-default/10')}
      icon={
        <Icon
          name="plus"
          className={cn('h-icon-sm w-icon-sm', watchlist ? 'stroke-blue-default' : 'stroke-text-subtle/70')}
        />
      }
      text="Watchlist"
      onClick={handleClick}
    />
  );
};

type MovieActionButtonProps = React.ComponentProps<'button'> & {
  icon: React.ReactNode;
  text: string;
};

const MovieActionButton = ({ icon, text, className, ...props }: MovieActionButtonProps) => {
  return (
    <button
      className={cn(
        'h-10 w-10 shrink-0 flex rounded-full cursor-pointer items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {icon}
      {/* <span className="text-text-subtle/70 text-sm font-medium">{text}</span> */}
    </button>
  );
};
