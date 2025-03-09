'use client';

import { cn } from '@/lib/utils/cn';
import { useMovieActivityStore } from '@/providers/MovieActivityStoreProvider';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

export const MovieActionsLikeButton = () => {
  const liked = useMovieActivityStore((s) => s.liked);
  const dispatch = useMovieActivityStore((s) => s.dispatch);

  const handleClick = () => {
    dispatch({ type: 'TOGGLE_LIKE' });
  };

  return (
    <Button
      className={cn(liked ? 'bg-orange-default/20' : 'bg-text-default/10')}
      // variant="ghost"
      // size="icon"
      // radius="circle"
      size="sm"
      onClick={handleClick}
    >
      <Icon
        name="heart"
        className={cn('size-icon', liked ? 'stroke-orange-default' : 'stroke-text-subtle/70')}
      />
    </Button>
  );
};
