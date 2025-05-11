'use client';

import { Movie } from '@repo/drizzle';
import { useListStore } from '@/store/list';

type Props = {
  index: number;
  initialMovie?: Movie;
};

export const MovieItem = ({ index }: Props) => {
  const { movie } = useListStore((store) => store.movies[index]);

  return (
    <div className="flex flex-col">
      <img
        className="shadow-lgs rounded-sm object-cover"
        src={`http://image.tmdb.org/t/p/w342${movie.posterPath}`}
      />
      <div className="mt-1 flex flex-col">
        <div className="text-sm font-medium text-neutral-300">{movie.title}</div>
        <div className="text-xs font-medium text-neutral-500">
          {new Date(movie.releaseDate).getFullYear()}
        </div>
      </div>
    </div>
  );
};
