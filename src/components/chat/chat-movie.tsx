'use client';

import { Eye, Heart, Plus } from 'lucide-react';

import type { MessageAssistant } from '@/lib/drizzle/types';
import { cn } from '@/lib/utils';
import { genreName, posterSrc, runtimeToHoursMins } from '@/lib/utils/movie';
import { useApiUpdateLibrary } from '@/hooks/use-api-update-library';
import { Button } from '../common/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../common/tooltip';

type Props = {
  title: string;
  why: string;
  releaseYear: string;
  movie?: MessageAssistant['movies'][number];
};

export const ChatMovie = ({ title, why, releaseYear, movie }: Props) => {
  return (
    <div className="group border-foreground-0/5 flex cursor-pointer border-b-1 px-2 py-2 last:border-0">
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
            <TooltipProvider>
              <div className="-mb-2 ml-auto flex items-center gap-1">
                <ChatMovieWatchlistButton movie={movie} />
                <ChatMovieWatchButton movie={movie} />
                <ChatMovieLikeButton movie={movie} />
              </div>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatMoviePoster = ({ movie }: { movie?: MessageAssistant['movies'][number] }) => {
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

const ChatMovieWatchlistButton = ({ movie }: { movie: MessageAssistant['movies'][number] }) => {
  const { mutate } = useApiUpdateLibrary();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={movie.watchlist ? 'primary' : 'ghost-2'}
          size="icon"
          className="rounded-full!"
          onClick={() => {
            mutate({ movieId: movie.movieId, watchlist: !movie.watchlist });
          }}
        >
          <Plus className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{movie.watchlist ? 'Remove from watchlist' : 'Add to watchlist'}</TooltipContent>
    </Tooltip>
  );
};

const ChatMovieWatchButton = ({ movie }: { movie: MessageAssistant['movies'][number] }) => {
  const { mutate } = useApiUpdateLibrary();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={movie.watched ? 'primary' : 'ghost-2'}
          size="icon"
          className="rounded-full!"
          onClick={() => {
            mutate({ movieId: movie.movieId, watched: !movie.watched });
          }}
        >
          <Eye className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{movie.watched ? 'Remove from watched' : 'Add to watched'}</TooltipContent>
    </Tooltip>
  );
};

const ChatMovieLikeButton = ({ movie }: { movie: MessageAssistant['movies'][number] }) => {
  const { mutate } = useApiUpdateLibrary();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={movie.liked ? 'primary' : 'ghost-2'}
          size="icon"
          className="rounded-full!"
          onClick={() => {
            mutate({ movieId: movie.movieId, liked: !movie.liked });
          }}
        >
          <Heart className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{movie.liked ? 'Remove from liked' : 'Add to liked'}</TooltipContent>
    </Tooltip>
  );
};
