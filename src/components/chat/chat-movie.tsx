'use client';

import { Eye, Heart, Plus } from 'lucide-react';

import type { Movie } from '@/lib/drizzle/types';
import { cn } from '@/lib/utils';
import { genreName, posterSrc, runtimeToHoursMins } from '@/lib/utils/movie';
import { Button } from '../common/button';

type Props = {
  title: string;
  why: string;
  releaseYear: string;
  movie?: Movie;
};

export const ChatMovie = ({ title, why, releaseYear, movie }: Props) => {
  return (
    <div className="group border-foreground-0/5 mx-2 flex cursor-pointer border-b-1 py-2 last:border-0">
      <ChatMoviePoster movie={movie} />

      <div className="ml-4 flex w-full flex-col py-2">
        <div className="mb-1 font-medium">
          {title} <span className="text-foreground-1 ml-1 text-xs">{releaseYear}</span>
        </div>
        <div className="text-foreground-1 max-w-3/4 text-sm">{why}</div>
        <div className="mt-auto flex items-baseline">
          {movie && (
            <div className="text-foreground-1 mt-auto flex gap-1 text-xs font-medium">
              <span>{runtimeToHoursMins(movie.source.runtime!)}</span>
              <span>•</span>
              {movie?.source.genres?.map((genre) => genreName(genre.name!)).join(', ')}
            </div>
          )}
          {movie && (
            <div className="-mb-2 ml-auto flex items-center">
              <ChatMovieWatchlistButton />
              <ChatMovieSeenButton />
              <ChatMovieLikeButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatMoviePoster = ({ movie }: { movie?: Movie }) => {
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

const ChatMovieWatchlistButton = () => {
  return (
    <Button variant="ghost" size="icon" className="text-foreground-3 hover:text-foreground-0 rounded-full!">
      <Plus className="size-5" />
    </Button>
  );
};

const ChatMovieSeenButton = () => {
  return (
    <Button variant="ghost" size="icon" className="text-foreground-3 hover:text-foreground-0 rounded-full!">
      <Eye className="size-5" />
    </Button>
  );
};

const ChatMovieLikeButton = () => {
  return (
    <Button variant="ghost" size="icon" className="text-foreground-3 hover:text-foreground-0 rounded-full!">
      <Heart className="size-5" />
    </Button>
  );
};
