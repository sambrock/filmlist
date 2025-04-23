import { useQuery } from '@tanstack/react-query';

import { trpc } from '../../lib/api/trpc';

export const useQuerySearchMovies = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => trpc.movies.search.query({ query }),
    enabled: Boolean(query),
  });
};
