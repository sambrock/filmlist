'use client';

import { useListStore } from '@/store/list';
import { MovieSearch } from '@/components/MovieSearch/MovieSearch';

export const ListViewSearch = () => {
  const dispatch = useListStore((store) => store.dispatch);

  return (
    <div className="fixed bottom-6 left-1/2 w-[600px] -translate-x-1/2">
      <MovieSearch onSelect={(movie) => dispatch({ type: 'ADD_MOVIE', payload: movie })} />
    </div>
  );
};
