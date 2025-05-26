'use client';

import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import { Combobox } from '@/components/common/Combobox';
import { IconAdd } from '@/components/common/Icon';
import { Kbd } from '@/components/common/Kbd';
import { cn } from '@/lib/utils';
import { ListMovieSearchInput } from './ListSearchInput';
import { ListMovieSearchMenu } from './ListSearchMenu';
import { ListMovieSearchMenuItem } from './ListSearchMenuItem';
import { useSearchMovies } from './hooks/useSearchMovies';

type Props = React.ComponentProps<'div'>;

export const ListSearch = ({ className, ...props }: Props) => {
  const [q, setQuery] = useState('');
  const [debounced] = useDebounceValue(q, 200);

  const { data, isLoading } = useSearchMovies(debounced);

  const showMenu = q.length > 0;
  const hasResults = data?.data && data?.data?.length > 0;

  return (
    <div
      className={cn(
        'border-border-1 bg-surface-1 flex flex-col items-center overflow-clip rounded-lg border shadow-sm',
        className
      )}
      {...props}
    >
      <Combobox items={data?.data || []}>
        <div className="h-input-md relative flex w-full items-center">
          <IconAdd className="size-icon text-text-secondary z-10 ml-3 self-center" />

          <Combobox.Input className="absolute left-0 w-full pl-12" asChild>
            <ListMovieSearchInput onChange={(e) => setQuery(e.target.value)} />
          </Combobox.Input>

          <Kbd className="absolute right-3">⌘K</Kbd>
        </div>

        <Combobox.Menu asChild>
          {showMenu && (
            <ListMovieSearchMenu isLoading={isLoading}>
              {hasResults ? (
                data.data.map((movie, index) => (
                  <Combobox.MenuItem key={movie.tmdbId} index={index} asChild>
                    <ListMovieSearchMenuItem movie={movie} />
                  </Combobox.MenuItem>
                ))
              ) : (
                <div className="text-text-secondary flex h-[62px] items-center justify-center px-2 text-sm">
                  {isLoading ? `Loading` : 'Not found'}
                </div>
              )}
            </ListMovieSearchMenu>
          )}
        </Combobox.Menu>
      </Combobox>
    </div>
  );
};
