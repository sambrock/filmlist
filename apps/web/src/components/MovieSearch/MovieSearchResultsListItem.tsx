import type { SearchMovieResult } from '@repo/api';
import { cn, srcTmdbImagePoster } from '../../lib/utils';

type MovieSearchResultsListItemProps = React.ComponentProps<'li'> & {
  movie: SearchMovieResult;
};

export const MovieSearchResultsListItem = ({
  movie,
  className,
  ...props
}: MovieSearchResultsListItemProps) => {
  return (
    <li
      className={cn('flex cursor-pointer items-center gap-3 rounded-lg py-1 px-3 hover:bg-neutral-800', className)}
      {...props}
    >
      <img
        className="w-8 rounded-xs object-cover shadow-md"
        src={srcTmdbImagePoster(movie.posterPath, 'w92')}
        alt={movie.title}
      />
      <div className="flex flex-col">
        <span className="mb-1 text-sm font-semibold text-neutral-300">{movie.title}</span>
        <span className="text-xs font-medium text-neutral-400">Dir. {movie.directors.join(', ')}</span>
      </div>
    </li>
  );
};
