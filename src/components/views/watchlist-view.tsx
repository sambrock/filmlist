import Link from 'next/link';
import { fetchQuery } from 'convex/nextjs';

import { api } from '@/infra/convex/_generated/api';
import { posterSrc } from '@/lib/utils';

export const WatchlistView = async () => {
  const watchlistData = await fetchQuery(api.watchlist.getWatchlist, {
    userId: 'db4ff88c-23e4-4d72-a49b-c29e7e5f5d06',
  });

  return (
    <main className="mx-auto my-6 max-w-6xl px-3">
      <h1 className="mt-20 text-2xl font-bold lg:mt-0">Watchlist</h1>

      {watchlistData.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
          {watchlistData.map((movie) => (
            <Link href={`/movie/${movie.tmdbId}`} key={movie.tmdbId}>
              <div className="pointer-cursor">
                <div className="overflow-clip rounded-sm md:rounded-md">
                  <img src={posterSrc(movie.posterPath, 'w500')} />
                </div>
                <div>
                  <div className="text-foreground-0 mt-2 text-sm font-medium">{movie.title}</div>
                  <div className="text-foreground-1 text-xs">{new Date(movie.releaseDate).getFullYear()}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};
