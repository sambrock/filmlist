import { Fragment, useRef, useState } from 'react';
import { useFloating } from '@floating-ui/react';

import { useQuerySearchMovies } from '../../hooks/api/useQuerySearchMovies';
import { useListStore } from '../../stores/useListStore';
import { IconPlus } from '../common/Icon';

const { dispatch } = useListStore.getState().actions;

export const MovieSearch = () => {
  const [query, setQuery] = useState('');

  const floating = useFloating({
    placement: 'top',
  });

  const searchMoviesQuery = useQuerySearchMovies(query);

  const timeoutRef = useRef<number>(null);

  return (
    <Fragment>
      <div
        ref={floating.refs.setFloating}
        className="rounded-md border border-neutral-800 bg-neutral-800 p-1 backdrop-blur shadow-md mb-8"
        style={floating.floatingStyles}
      >
        {searchMoviesQuery.data?.map((m) => <div key={m.tmdbId}>{m.title}</div>)}
      </div>

      <div
        ref={floating.refs.setReference}
        className="group flex flex-col rounded-full border border-neutral-800 bg-neutral-900 p-2 shadow-md focus-within:ring-2 focus-within:ring-blue-500/50"
      >
        <div className="flex w-full items-center">
          <IconPlus className="mr-1 ml-2 stroke-neutral-600" />
          <input
            className="w-full px-2 text-base font-medium placeholder:text-neutral-600 focus:outline-none"
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
