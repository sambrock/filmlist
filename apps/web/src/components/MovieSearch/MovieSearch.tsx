'use client';

import { useState } from 'react';
import { FloatingFocusManager } from '@floating-ui/react';
import { useDebounceValue } from 'usehooks-ts';

import { Movie } from '@repo/drizzle';
import { useCombobox } from '@/hooks/useCombobox';
import { cn } from '@/lib/utils';
import { IconAdd } from '../common/Icon';
import { MovieSearchInput } from './MovieSearchInput';
import { MovieSearchResult } from './MovieSearchResult';
import { MovieSearchResults } from './MovieSearchResults';
import { useSearchQuery } from './hooks/useSearchQuery';

type Props = React.ComponentProps<'div'> & {
  onMovieSelect: (movie: Movie) => void;
};

export const MovieSearch = ({ onMovieSelect, className, ...props }: Props) => {
  const [q, setQuery] = useState('');

  const [debounced] = useDebounceValue(q, 200);

  const { data } = useSearchQuery(debounced);

  const { open, activeIndex, floating, getInputProps, getMenuProps, getItemProps } = useCombobox({
    items: data?.data,
    onSelect: (movie) => {
      // TODO: fix this
      onMovieSelect?.({
        ...movie,
        createdAt: new Date(),
      });
    },
  });

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-[#414141] bg-[#373737] shadow-md backdrop-blur-md',
        className
      )}
      {...props}
    >
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
        <IconAdd className="ml-4 stroke-[#7c7c7c]" />
        <MovieSearchInput
          className="absolute left-0 ml-8"
          placeholder="Add film"
          {...getInputProps({
            onChange: (e) => setQuery((e.target as HTMLInputElement).value),
          })}
        />
      </div>
    </div>
  );
};
