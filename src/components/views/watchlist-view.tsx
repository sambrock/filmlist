import Link from 'next/link';
import { fetchQuery } from 'convex/nextjs';

import { api } from '@/infra/convex/_generated/api';
import { getUserFromAuthTokenCookie } from '@/lib/auth';
import { posterSrc } from '@/lib/utils';

export const WatchlistView = async () => {
  const user = await getUserFromAuthTokenCookie();

  const watchlistData = await fetchQuery(api.watchlist.getWatchlist, {
    userId: user?.userId || '',
  });

  return (
    <main className="mx-auto my-6 max-w-6xl px-3">
      <h1 className="mt-20 text-2xl font-bold lg:mt-10">
        Watchlist
        <span className="text-foreground-1 ml-3 text-xs font-medium">{watchlistData.length} films</span>
      </h1>

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
