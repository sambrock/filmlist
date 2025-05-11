'use client';

import { useState } from 'react';
import { FloatingFocusManager } from '@floating-ui/react';
import { useDebounceValue } from 'usehooks-ts';

import type { Movie } from '@repo/drizzle';
import { cn } from '@/lib/utils';
import { useCombobox } from '@/hooks/useCombobox';
import { IconAdd } from '../common/Icon';
import { MovieSearchInput } from './MovieSearchInput';
import { MovieSearchResult } from './MovieSearchResult';
import { MovieSearchResults } from './MovieSearchResults';
import { useSearchQuery } from './hooks/useSearchQuery';

type Props = {
  onSelect?: (movie: Movie) => void;
};

export const MovieSearch = ({ onSelect }: Props) => {
  const [q, setQuery] = useState('');

  const [debounced] = useDebounceValue(q, 200);

  const { data } = useSearchQuery(debounced);

  const { open, activeIndex, floating, getInputProps, getMenuProps, getItemProps } = useCombobox({
    items: data?.data,
    onSelect: (movie) => {
      onSelect?.({
        tmdbId: movie.tmdbId,
        title: movie.title,
        releaseDate: movie.releaseDate,
        posterPath: movie.posterPath,
        movieId: movie.tmdbId,
        createdAt: new Date(),
      });
    },
  });

  return (
    <div className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md">
      {open && (
        <FloatingFocusManager context={floating.context} initialFocus={-1}>
          <MovieSearchResults className={cn(!open && 'hidden')} {...getMenuProps()}>
            {data?.data?.map((movie, index) => (
              <MovieSearchResult
                key={movie.tmdbId}
                movie={movie}
                active={activeIndex === index}
                {...getItemProps(index)}
              />
            ))}
          </MovieSearchResults>
        </FloatingFocusManager>
      )}

      <div
        className={cn(
          'relative flex h-12 items-center border-t',
          open ? 'border-neutral-800' : 'border-transparent'
        )}
      >
        <IconAdd className="ml-4 stroke-neutral-600" />
        <MovieSearchInput
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
