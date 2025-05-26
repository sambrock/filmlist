'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useDebounceValue } from 'usehooks-ts';

import { Movie } from '@repo/drizzle';
import { api } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import { Combobox } from '../common/Combobox';
import { IconAdd } from '../common/Icon';
import { Kbd } from '../common/Kbd';
import { Poster } from '../common/Poster';

type Props = React.ComponentProps<'div'>;

export const ListSearch = ({ className, ...props }: Props) => {
  const [q, setQuery] = useState('');
  const [debounced] = useDebounceValue(q, 200);

  const { data, isLoading } = useSWR(
    ['search', debounced],
    () =>
      q
        ? api.GET('/v1/movies/search', {
            params: {
              query: { q: debounced },
            },
          })
        : null
    // { keepPreviousData: true }
  );

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
        <div className="h-input-md relative mx-auto flex w-full items-center">
          <IconAdd className="size-icon text-text-secondary z-10 ml-3 self-center" />

          <Combobox.Input className="absolute left-0 w-full pl-12" asChild>
            <ListMovieSearchInput onChange={(e) => setQuery(e.target.value)} />
          </Combobox.Input>

          <Kbd className="absolute right-3">⌘K</Kbd>
        </div>

        <div className="flex w-full flex-col">
          <Combobox.Menu asChild>
            {showMenu && (
              <ListMovieSearchMenu>
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

          {/* <ListMovieSearchMenuHelp /> */}
        </div>
      </Combobox>
    </div>
  );
};

type ListMovieSearchInputProps = React.ComponentProps<'input'>;

const ListMovieSearchInput = ({ className, ...props }: ListMovieSearchInputProps) => {
  return (
    <input
      className={cn(
        'placeholder:text-text-primary/50 h-input-md absolute text-sm focus:outline-none',
        className
      )}
      placeholder="Add film"
      {...props}
    />
  );
};

type ListMovieSearchMenuProps = React.ComponentProps<'div'>;

const ListMovieSearchMenu = (props: ListMovieSearchMenuProps) => {
  return (
    <div className="border-border-1 flex w-full flex-col gap-1 border-t p-2">
      {props.children}
      <div></div>
    </div>
  );
};

type ListMovieSearchMenuItemProps = React.ComponentProps<'div'> & {
  movie: Omit<Movie, 'createdAt'> & { directors: string[] }; // TODO: Fix this type
};

const ListMovieSearchMenuItem = ({ movie, className, ...props }: ListMovieSearchMenuItemProps) => {
  return (
    <div
      className={cn(
        'group data-[active="true"]:bg-surface-2 border-border-1 flex cursor-pointer items-center gap-3 rounded-md p-1 last:border-none',
        className
      )}
      {...props}
    >
      <div className="bg-surface-0 aspect-[1/1.5] w-9 overflow-clip rounded-xs">
        <Poster remote="tmdb" size="w92" posterPath={movie.posterPath} />
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="text-sm">
          <span className="font-medium">{movie.title}</span>
          <span className="text-text-secondary ml-2 text-xs font-medium">
            {new Date(movie.releaseDate).getFullYear()}
          </span>
        </div>
        <div className="text-text-secondary text-xs font-medium">Dir. {movie.directors.join(', ')}</div>
      </div>
    </div>
  );
};

// const ListMovieSearchMenuHelp = () => {
//   return (
//     <div className="bg-surface-1 border-border-1 flex h-7 items-center border-t px-2">
//       <div className="ml-auto flex items-center gap-2">
//         <span className="text-text-secondary/70 text-xs font-medium">Add to list</span>
//         <Kbd className="pt-[4px]">↵</Kbd>
//       </div>
//     </div>
//   );
// };
