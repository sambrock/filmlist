'use client';

import type { MessageAssistant } from '@/lib/drizzle/types';
import { cn } from '@/lib/utils/cn';
import { posterSrc, runtimeToHoursMins } from '@/lib/utils/movie';

type Props = {
  message: MessageAssistant;
} & React.ComponentProps<'div'>;

export const ChatMessageAssistant = ({ message, className, ...props }: Props) => {
  const getMovie = (tmdbId: number) => {
    return message.movies.find((movie) => movie.tmdbId === tmdbId);
  };

  return (
    <div className={cn('mb-20', className)} {...props}>
      <div className="bg-background-0/50 rounded-xl">
        {message.structured?.map((structured, index) => (
          <div key={index} className="border-foreground-0/5 flex border-b-2 px-2 py-2 last:border-0">
            <div className="w-26 overflow-clip rounded-sm shadow-md shadow-black/20">
              <img
                src={posterSrc(getMovie(structured.tmdbId)?.source.poster_path, 'w185')}
                alt={structured.title}
              />
            </div>

            <div className="ml-6 flex w-full flex-col py-2">
              <div className="mb-1 font-medium">
                {structured.title}{' '}
                <span className="text-foreground-1 ml-1 text-xs">{structured.releaseYear}</span>
              </div>
              <div className="text-foreground-1 max-w-3/4 text-sm">{structured.why}</div>
              <div className="text-foreground-1 mt-auto flex gap-1 text-xs font-medium">
                <span>{runtimeToHoursMins(getMovie(structured.tmdbId)?.source.runtime)}</span>
                <span>•</span>
                {getMovie(structured.tmdbId)
                  ?.source.genres?.map((genre) => genre.name)
                  .join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
