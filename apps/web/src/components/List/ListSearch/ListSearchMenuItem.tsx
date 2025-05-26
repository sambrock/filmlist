import type { Movie } from '@repo/drizzle';
import { Poster } from '@/components/common/Poster';
import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'div'> & {
  movie: Omit<Movie, 'createdAt'> & { directors: string[] }; // TODO: Fix this type
};

export const ListMovieSearchMenuItem = ({ movie, className, ...props }: Props) => {
  return (
    <div
      className={cn(
        'group data-[active="true"]:bg-surface-2 border-border-1 flex cursor-pointer items-center gap-3 rounded-md p-1 last:border-none',
        className
      )}
      {...props}
    >
      <div className="bg-surface-0 aspect-[1/1.5] w-9 overflow-clip rounded-xs">
        <Poster remote="tmdb" size="w92" posterPath={movie.posterPath} />
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="text-sm">
          <span className="font-medium">{movie.title}</span>
          <span className="text-text-secondary ml-2 text-xs font-medium">
            {new Date(movie.releaseDate).getFullYear()}
          </span>
        </div>
        <div className="text-text-secondary text-xs font-medium">Dir. {movie.directors.join(', ')}</div>
      </div>
    </div>
  );
};
