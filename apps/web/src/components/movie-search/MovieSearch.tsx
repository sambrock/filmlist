'use client';

import { Fragment, useRef, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { trpc } from '@/lib/trpc';
import { MovieSearchInput } from './MovieSearchInput';
import { MovieSearchResult } from './MovieSearchResult';
import { MovieSearchResults } from './MovieSearchResults';

export const MovieSearch = () => {
  const [query, setQuery] = useState('');

  const response = useQuery({
    queryFn: () => trpc.searchMovies.query({ query }),
    queryKey: ['trpc.searchMovies', query],
    enabled: Boolean(query),
  });

  const timeoutRef = useRef<NodeJS.Timeout>(); // Debounce input

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setQuery(e.target.value);
    }, 300);
  };

  return (
    <Fragment>
      <MovieSearchInput onChange={handleChange} />
      {response.data && (
        <MovieSearchResults>
          {response.data?.map((movie) => (
            <Link
              key={movie.movieId}
              href={`/film/${movie.movieId}-${movie.title.replace(/ /g, '-').toLowerCase()}`}
            >
              <MovieSearchResult movie={movie} />
            </Link>
          ))}
        </MovieSearchResults>
      )}
    </Fragment>
  );
};
