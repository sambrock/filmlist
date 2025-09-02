'use client';

import type { Movie } from '@/lib/drizzle/types';
import { cn } from '@/lib/utils/cn';
import { posterSrc, runtimeToHoursMins } from '@/lib/utils/movie';

type Props = {
  title: string;
  why: string;
  releaseYear: string;
  movie?: Movie;
};

export const ChatMovie = ({ title, why, releaseYear, movie }: Props) => {
  return (
    <div className="border-foreground-0/5 mx-2 flex border-b-1 py-2 last:border-0">
      <ChatMoviePoster movie={movie} />

      <div className="ml-4 flex w-full flex-col py-2">
        <div className="mb-1 font-medium">
          {title} <span className="text-foreground-1 ml-1 text-xs">{releaseYear}</span>
        </div>
        <div className="text-foreground-1 max-w-3/4 text-sm">{why}</div>
        {movie && (
          <div className="text-foreground-1 mt-auto flex gap-1 text-xs font-medium">
            <span>{runtimeToHoursMins(movie.source.runtime!)}</span>
            <span>•</span>
            {movie?.source.genres?.map((genre) => overrideGenreName(genre.name!)).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatMoviePoster = ({ movie }: { movie?: Movie }) => {
  return (
    <div className={cn('bg-background-4 aspect-[1/1.5] w-26 overflow-clip rounded-sm')}>
      {movie && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="object-fit"
          src={posterSrc(movie.source.poster_path!, 'w185')}
          alt={movie.source.title!}
        />
      )}
    </div>
  );
};

const overrideGenreName = (name: string) => {
  if (name === 'Science Fiction') {
    return 'Sci-Fi';
  }
  return name;
};
