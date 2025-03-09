'use client';

import { cn } from '@/lib/utils/cn';
import { useMovieActivityStore } from '@/providers/MovieActivityStoreProvider';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

export const MovieActionsWatchButton = () => {
  const watched = useMovieActivityStore((s) => s.watched);
  const dispatch = useMovieActivityStore((s) => s.dispatch);

  const handleClick = () => {
    dispatch({ type: 'TOGGLE_WATCH' });
  };

  return (
    <Button
      className={cn(watched ? 'bg-green-default/20' : 'bg-text-default/10')}
      // size="icon"
      // radius="circle"
      size="sm"
      onClick={handleClick}
    >
      <Icon
        name="eye"
        className={cn('size-icon', watched ? 'stroke-green-default' : 'stroke-text-subtle/70')}
      />
    </Button>
  );
};
