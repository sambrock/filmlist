'use client';

import { useState } from 'react';
import { FloatingFocusManager } from '@floating-ui/react';
import { useDebounceValue } from 'usehooks-ts';

import { useCombobox } from '@/hooks/useCombobox';
import { cn } from '@/lib/utils';
import { useListStore } from '@/store/list';
import { IconAdd } from '../common/Icon';
import { ListMovieSearchInput } from './ListMovieSearchInput';
import { ListMovieSearchResult } from './ListMovieSearchResult';
import { ListMovieSearchResults } from './ListMovieSearchResults';
import { useSearchQuery } from './hooks/useSearchQuery';

type Props = React.ComponentProps<'div'>;

export const ListMovieSearch = ({ className, ...props }: Props) => {
  const [q, setQuery] = useState('');

  const dispatch = useListStore((state) => state.dispatch);

  const [debounced] = useDebounceValue(q, 200);

  const { data } = useSearchQuery(debounced);

  const { open, activeIndex, floating, getInputProps, getMenuProps, getItemProps } = useCombobox({
    items: data?.data,
    onSelect: (movie) => {
      dispatch({
        type: 'ADD_MOVIE',
        payload: {
          tmdbId: movie.tmdbId,
          title: movie.title,
          releaseDate: movie.releaseDate,
          posterPath: movie.posterPath,
          movieId: movie.tmdbId,
          createdAt: new Date(),
        },
      });
    },
  });

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md',
        className
      )}
      {...props}
    >
      {open && (
        <FloatingFocusManager context={floating.context} initialFocus={-1}>
          <ListMovieSearchResults className={cn(!open && 'hidden')} {...getMenuProps()}>
            {data?.data?.map((movie, index) => (
              <ListMovieSearchResult
                key={movie.tmdbId}
                movie={movie}
                active={activeIndex === index}
                {...getItemProps(index)}
              />
            ))}
          </ListMovieSearchResults>
        </FloatingFocusManager>
      )}

      <div
        className={cn(
          'relative flex h-12 items-center border-t',
          open ? 'border-neutral-800' : 'border-transparent'
        )}
      >
        <IconAdd className="ml-4 stroke-neutral-600" />
        <ListMovieSearchInput
          className="absolute left-0 ml-8"
          placeholder="Add a film"
          {...getInputProps({
            onChange: (e) => setQuery((e.target as HTMLInputElement).value),
          })}
        />
      </div>
    </div>
  );
};
