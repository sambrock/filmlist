import useSWR from 'swr';

import { api } from '@/lib/api/client';

export const useSearchMovies = (query: string) => {
  const parsed = parseSearchQuery(query);

  return useSWR(['search', query], () =>
    query
      ? api.GET('/v1/movies/search', {
          params: {
            query: {
              q: parsed.query,
              year: parsed.year,
              director: parsed.director,
            },
          },
        })
      : null
  );
};

export const parseSearchQuery = (query: string) => {
  // TODO: search by actor?

  let year: string | undefined;
  let director: string | undefined;

  const matchedYear = query.replace(/y:\s+/g, 'y:').match(/y:\d*/g);
  if (matchedYear) {
    year = matchedYear[0].replace('y:', '');
  }

  const matchedDirector = query.replace(/d:\s+/g, 'd:').match(/d:".*?"|d:\w+/g);
  if (matchedDirector) {
    director = matchedDirector[0].replace('d:', '').replaceAll('\"', '');
  }

  const cleanQuery = query.replace(/y:.+/, '').replace(/d:.+/, '').trim();

  return {
    query: cleanQuery,
    year,
    director,
  };
};
