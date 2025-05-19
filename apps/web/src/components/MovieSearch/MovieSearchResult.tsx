import { forwardRef, useId } from 'react';

import { Poster } from '@/components/common/Poster';
import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'div'> & {
  active: boolean;
  movie: { title: string; posterPath: string; directors: string[]; releaseDate: string };
};

export const MovieSearchResult = forwardRef<HTMLDivElement, Props>(
  ({ active, movie, className, ...props }, ref) => {
    const id = useId();
    return (
      <div
        ref={ref}
        id={id}
        role="option"
        className={cn(
          'flex cursor-pointer items-center gap-4 rounded-md px-2 py-1 hover:bg-neutral-800',
          active && 'bg-neutral-800',
          className
        )}
        {...props}
      >
        <Poster remote="tmdb" size="w154" posterPath={movie.posterPath} className="w-[36px] rounded-xs" />

        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-neutral-300">{movie.title}</span>
            <span className="text-xs font-medium text-neutral-300/60">
              {new Date(movie.releaseDate).getFullYear()}
            </span>
          </div>
          <div className="text-sm text-neutral-300/50">Dir. {movie.directors.join(', ')}</div>
        </div>
      </div>
    );
  }
);

MovieSearchResult.displayName = 'MovieSearchResult';
