import type { Movie } from '@/lib/drizzle/zod';
import { backdropSrc, posterSrc } from '@/lib/utils/app.utils';

type Props = {
  movies: Movie[];
};

export const ChatMessageMovies = ({ movies }: Props) => {
  return (
    <div className="bg-background-0  my-4 rounded-lg px-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        {movies.map((movie) => (
          <div key={movie.movieId} className="flex flex-col">
            <div className="relative overflow-clip rounded-sm">
              <img
                src={posterSrc(movie.posterPath, 'w500')}
                className="absolute bottom-2 left-2 w-20 rounded-sm"
                alt={movie.title}
              />
              <img src={backdropSrc(movie.backdropPath, 'w780')} alt={movie.title} />
            </div>
            <div>
              <div>{movie.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
