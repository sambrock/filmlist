import type { Movie } from '@/lib/drizzle/zod';
import { posterSrc } from '@/lib/utils/app.utils';

type Props = {
  movies: Movie[];
};

export const ChatMessageMovies = ({ movies }: Props) => {
  return (
    <div className="border-background-1 bg-background-0 grid grid-cols-4 gap-3 rounded-lg border p-3">
      {movies.slice(0, 4).map((movie) => (
        <div key={movie.movieId} className="flex flex-col rounded-md">
          <div className="relative overflow-clip rounded-sm">
            <img src={posterSrc(movie.posterPath, 'w500')} className="rounded-sm" alt={movie.title} />
          </div>
          <div className="mt-2 px-0.5">
            <div className="text-foreground-0 text-sm font-medium">{movie.title}</div>
            <div className="text-foreground-1 text-xs font-medium">
              {new Date(movie.releaseDate).getFullYear()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
