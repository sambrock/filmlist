import { SearchMovieResult } from '@filmlist/api';
import { cn } from '@/lib/utils/cn';
import { posterSrc } from '@/lib/utils/imageSrc';

type MovieSearchResultProps = React.ComponentProps<'div'> & {
  movie: SearchMovieResult;
};

export const MovieSearchResult = ({ movie, className, ...props }: MovieSearchResultProps) => {
  return (
    <div
      className={cn(
        'group flex cursor-pointer items-center rounded-md px-2.5 py-1.5 hover:bg-neutral-800',
        className
      )}
      {...props}
    >
      <div className="rounded-xs overflow-clip aspect-[1/1.5] w-9">
        <img className="object-cover" src={posterSrc(movie.posterPath, 'tmdb', 'w92')} />
      </div>
      <div className="ml-3 flex flex-col">
        <div className="flex items-baseline">
          <span className="text-sm font-medium">{movie.title}</span>
          <span className="text-neutral-400 ml-1 text-xs">{new Date(movie.releaseDate).getFullYear()}</span>
        </div>
        <div className="text-neutral-400 text-xs">Dir. {movie.directors?.join(',')}</div>
      </div>
    </div>
  );
};
