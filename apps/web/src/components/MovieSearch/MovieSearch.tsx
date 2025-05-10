'use client';

import { Fragment, useRef, useState } from 'react';
import {
  FloatingFocusManager,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';

import type { Movie } from '@repo/drizzle';
import { cn } from '@/lib/utils';
import { IconAdd } from '../common/Icon';
import { MovieSearchInput } from './MovieSearchInput';
import { MovieSearchResult } from './MovieSearchResult';
import { MovieSearchResults } from './MovieSearchResults';
import { useSearchQuery } from './hooks/useSearchQuery';

type Props = {
  onSelect?: (movie: Movie) => void;
};

export const MovieSearch = ({ onSelect }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');

  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const { data } = useSearchQuery(searchQuery);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { refs, context } = useFloating<HTMLInputElement>({
    open: true,
  });

  const listRef = useRef<HTMLDivElement[]>([]);

  const role = useRole(context, { role: 'listbox' });
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
    virtual: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([role, listNavigation]);

  const showResults = data && data.data && data.data?.length > 0;

  return (
    <div className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md">
      {showResults && (
        <FloatingFocusManager context={context} initialFocus={-1}>
          {
            <MovieSearchResults ref={refs.setFloating} {...getFloatingProps()}>
              {data?.data?.map((movie, index) => (
                <MovieSearchResult
                  key={movie.tmdbId}
                  ref={(node) => {
                    if (node) {
                      listRef.current[index] = node;
                    }
                  }}
                  movie={movie}
                  active={activeIndex === index}
                  {...getItemProps()}
                />
              ))}
            </MovieSearchResults>
          }
        </FloatingFocusManager>
      )}

      <div
        className={cn(
          'relative flex h-12 items-center border-t',
          showResults ? 'border-neutral-800' : 'border-transparent'
        )}
      >
        <IconAdd className="ml-4 stroke-neutral-600" />
        <MovieSearchInput
          ref={refs.setReference}
          className="absolute left-0 ml-8"
          placeholder="Add a film"
          onChange={(e) => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              setSearchQuery(e.target.value);
            }, 200);
          }}
          aria-autocomplete="list"
          {...getReferenceProps()}
        />
      </div>
    </div>
  );
};
