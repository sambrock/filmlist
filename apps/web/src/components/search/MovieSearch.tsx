import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { trpc } from '../../lib/trpc';

export const MovieSearch = () => {
  const [query, setQuery] = useState('');

  const searchMoviesQuery = useQuery({
    queryKey: ['search', query],
    queryFn: () => trpc.searchMovies.query({ query }),
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
