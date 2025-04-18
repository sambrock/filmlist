import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { trpc } from '../../lib/api/trpc';
import { useListStore } from '../../stores/useListStore';

const { dispatch } = useListStore.getState().actions;

export const MovieSearch = () => {
  const [query, setQuery] = useState('');

  const timeoutRef = useRef<number>(null);

  const searchMoviesQuery = useQuery({
    queryKey: ['search', query],
    queryFn: () => trpc.movies.search.query({ query }),
    enabled: Boolean(query),
  });

  return (
    <div>
      <input
        className="bg-neutral-700"
        onChange={(e) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            setQuery(e.target.value);
          }, 500);
        }}
      />

      {searchMoviesQuery.data?.map((m) => (
        <div
          key={m.tmdbId}
          className="flex cursor-pointer items-center gap-2 p-2 hover:bg-neutral-700"
          onClick={() => {
            dispatch({
              type: 'ADD_MOVIE',
              payload: {
                tmdbId: m.tmdbId,
                title: m.title,
                posterPath: m.posterPath,
              },
            });
          }}
        >
          {m.title}
        </div>
      ))}
    </div>
  );
};
