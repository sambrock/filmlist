import { Fragment, useRef, useState } from 'react';
import { useFloating } from '@floating-ui/react';

import { useQuerySearchMovies } from '../../hooks/api/useQuerySearchMovies';
import { useListStore } from '../../stores/useListStore';
import { IconPlus } from '../common/Icon';
import { MovieSearchResults } from './MovieSearchResults';
import { MovieSearchResultsItem } from './MovieSearchResultsItem';

// const { dispatch } = useListStore.getState().actions;

export const MovieSearch = () => {
  const [query, setQuery] = useState('');

  const floating = useFloating({
    placement: 'top',
  });

  const searchMoviesQuery = useQuerySearchMovies(query);

  const timeoutRef = useRef<number>(null);

  return (
    <Fragment>
      <MovieSearchResults ref={floating.refs.setFloating} style={floating.floatingStyles}>
        {searchMoviesQuery.data?.map((m) => <MovieSearchResultsItem key={m.tmdbId} movie={m} />)}
      </MovieSearchResults>

      <div
        ref={floating.refs.setReference}
        className="group flex flex-col rounded-full border border-neutral-800 bg-neutral-900 p-2 shadow-md focus-within:ring-2 focus-within:ring-blue-500/50"
      >
        <div className="flex w-full items-center">
          <IconPlus className="mr-1 ml-2 stroke-neutral-600" />
          <input
            className="w-full px-2 text-sm font-medium placeholder:text-neutral-600 focus:outline-none"
            placeholder="Add film"
            onChange={(e) => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              timeoutRef.current = setTimeout(() => {
                setQuery(e.target.value);
              }, 500);
            }}
          />
        </div>
      </div>
    </Fragment>
  );
};
