import Link from 'next/link';

import { trpc } from '@/lib/trpc';
import { Icon } from '@/components/common/Icon';

type MovieViewCastProps = {
  movieId: number;
  title: string;
};

export const MovieViewStreaming = async ({ movieId, title }: MovieViewCastProps) => {
  const providers = await trpc.movies.getMovieWatchProviders.query({ movieId });

  return (
    <div className="relative">
      <div className="no-scrollbar flex snap-x snap-mandatory scroll-px-8 gap-4 overflow-x-scroll px-4">
        {providers.map((p) => (
          <div
            key={p.providerId}
            className="bg-text-subtle/10 flex h-[4rem] w-[20rem] shrink-0 snap-start items-center rounded-lg px-4 first:ml-[-16px]"
          >
            <img
              className="mr-2 size-8 rounded-sm"
              src={`/providers/${p.providerName.toLowerCase().replaceAll(' ', '-')}.webp`}
            />
            <Link
              href={`https://www.google.com/search?btnI=1&q=${p.providerName} ${title}`}
              target="_blank"
              className="flex items-center gap-1"
            >
              <div className="text-sm font-medium">{p.providerName}</div>
              <Icon name="launch" className="text-text-muted size-4" />
            </Link>
            <div className="ml-auto flex gap-2 text-sm">
              {p.options.map((option, index) => (
                <div
                  key={index}
                  className="text-text-subtle/80 bg-bg-default/30 inline-flex h-6 items-center justify-center rounded-sm px-2 py-1 text-xs leading-0 font-medium"
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="from-bg-subtle/60 absolute top-0 left-0 h-full w-4 bg-linear-to-r to-transparent" />
      <div className="from-bg-subtle/60 absolute top-0 right-0 h-full w-4 bg-linear-to-l to-transparent" />
    </div>
  );
};
