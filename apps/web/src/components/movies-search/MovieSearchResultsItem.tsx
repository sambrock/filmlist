import type { SearchMovieResult } from '@repo/api';
import { cn, srcTmdbImagePoster } from '../../lib/utils';

type MovieSearchResultsItemProps = React.ComponentProps<'li'> & {
  movie: SearchMovieResult;
};

export const MovieSearchResultsItem = ({ movie, className, ...props }: MovieSearchResultsItemProps) => {
  return (
    <li className={cn('flex items-center gap-2', className)} {...props}>
      <img
        className="w-10 rounded-xs object-cover"
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
