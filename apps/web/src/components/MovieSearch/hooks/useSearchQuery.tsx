import useSWR from 'swr';

import { api } from '@/lib/api';

export const useSearchQuery = (q: string, year?: string | number, director?: string) => {
  return useSWR(
    ['search', q, year, director],
    () =>
      q
        ? api.GET('/v1/movies/search', {
            params: {
              query: {
                q,
                year: year ? String(year) : undefined,
                director,
              },
            },
          })
        : null,
    {
      keepPreviousData: true,
    }
  );
};
