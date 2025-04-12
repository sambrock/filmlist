import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounceValue } from 'usehooks-ts';

import { trpc } from '../../lib/trpc';

export const MovieSearch = () => {
  const [query, setQuery] = useState('');

  const [debouncedQuery] = useDebounceValue(query, 200);

  const searchMoviesQuery = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => trpc.movies.search.query({ query: debouncedQuery }),
    enabled: Boolean(query),
  });

  return (
    <div>
      <input
        className="bg-neutral-700"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />

      {searchMoviesQuery.data?.map((m) => <div key={m.movieId}>{m.title}</div>)}
    </div>
  );
};
