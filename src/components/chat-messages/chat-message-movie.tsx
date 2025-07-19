'use client';

import { Movie } from '@/lib/drizzle/zod';
import { posterSrc } from '@/lib/utils';

type Props = {
  title?: string;
  releaseYear?: string;
  why?: string;
  movie?: Movie;
};

export const ChatMessageMovie = ({ title, releaseYear, why, movie }: Props) => {
  return (
    <div className="flex gap-2 rounded-lg bg-white/5 p-2">
      <div className="w-28 shrink-0 drop-shadow-lg drop-shadow-black/40">
        {movie && (
          <img
            className="rounded-md object-cover"
            src={posterSrc(movie.source!.poster_path!, 'w500')}
            alt={title}
          />
        )}
      </div>
      <div className="ml-2 flex flex-col">
        <div className="text-foreground-0 font-semibold">{title}</div>
        <div className="text-foreground-1 text-xs font-medium">{releaseYear}</div>
        <div className="text-foreground-0/80 mt-2 text-sm">{why}</div>
      </div>
    </div>
  );
};
