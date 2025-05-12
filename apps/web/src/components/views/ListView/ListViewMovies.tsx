'use client';

import { useListStore } from '@/store/list';
import { MovieGrid } from '@/components/MovieGrid/MovieGrid';
import { MovieItem } from '@/components/MovieItem/MovieItem';

export const ListViewMovies = () => {
  const listMovies = useListStore((store) => [...store.listMovies.values()]);

  return (
    <MovieGrid className="mx-auto max-w-[1100px]">
      {listMovies.map((listMovie, index) => (
        <MovieItem key={index} movieId={listMovie.movieId} />
      ))}
    </MovieGrid>
  );
};
