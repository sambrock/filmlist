'use client';

import { useListStore } from '@/store/list';
import { MovieSearch } from '../MovieSearch/MovieSearch';

type Props = React.ComponentProps<'div'>;

export const ListSearch = (props: Props) => {
  const dispatch = useListStore((state) => state.dispatch);

  return (
    <MovieSearch onMovieSelect={(movie) => dispatch({ type: 'ADD_MOVIE', payload: movie })} {...props} />
  );
};
