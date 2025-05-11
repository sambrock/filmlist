'use client';

import { useListStore } from '@/store/list';
import { MovieGrid } from '@/components/MovieGrid/MovieGrid';
import { MovieItem } from '@/components/MovieItem/MovieItem';

export const ListViewMovies = () => {
  const keys = useListStore((store) => store.movies);

  return (
    <MovieGrid className="mx-auto max-w-[1100px]">
      {keys.map((_, index) => (
        <MovieItem key={index} index={index} />
      ))}
    </MovieGrid>
  );
};
