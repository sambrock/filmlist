'use client';

import Link from 'next/link';

import { Doc } from '@/infra/convex/_generated/dataModel';
import { cn, genreName, posterSrc, runtimeToHoursMins } from '@/lib/utils';
import { TooltipProvider } from '../common/tooltip';
import { MovieWatchlistButton } from './movie-watchlist-button';

type Props = {
  movie: NonNullable<Doc<'messages'>['movies']>[number];
};

export const MessageMovie = ({ movie }: Props) => {
  return (
    <div className="group border-foreground-0/5 flex cursor-pointer border-b-1 px-2 py-2 last:border-0">
      <Link
        href={movie.found ? `/movie/${movie.tmdbId}` : '#'}
        className="focus-visible:ring-ring flex w-full rounded-md focus:outline-none focus-visible:ring focus-visible:ring-2"
        onClick={(e) => {
          if (!movie.found) {
            e.preventDefault();
          }
        }}
      >
        <div
          className={cn('bg-background-4 w-20 self-start overflow-clip rounded-sm md:aspect-[1/1.5] md:w-26')}
        >
          {movie.found && (
            <img className="object-fit" src={posterSrc(movie.posterPath, 'w185')} alt={movie.title} />
          )}
        </div>

        <div className="ml-4 flex w-full flex-col py-2">
          <div className="mb-1 font-semibold">
            {movie.title}{' '}
            <span className="text-foreground-1 ml-1 text-xs font-medium">
              {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''}
            </span>
          </div>
          <div className="text-foreground-1 text-sm md:max-w-3/4">{movie.why}</div>
          <div className="mt-2 flex items-baseline md:mt-auto">
            {movie.found && (
              <div className="text-foreground-1 mt-auto flex gap-3 text-xs font-medium">
                <span>{runtimeToHoursMins(movie.runtime!)}</span>
                <span>{movie.genres.map((genre) => genreName(genre)).join(', ')}</span>
                {movie.directors && <span className="hidden md:block">Dir. {movie.directors}</span>}
              </div>
            )}
          </div>
        </div>
      </Link>

      {movie.found && (
        <TooltipProvider>
          <div className="ml-auto flex items-end gap-1">
            <MovieWatchlistButton
              tmdbId={movie.tmdbId}
              title={movie.title}
              releaseDate={movie.releaseDate}
              posterPath={movie.posterPath}
            />
          </div>
        </TooltipProvider>
      )}
    </div>
  );
};
