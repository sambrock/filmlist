'use client';

import { useRef } from 'react';
import { default as microdiff } from 'microdiff';

import { trpc } from '@/lib/trpc';
import { useMovieActivityStoreSubscribe } from '@/providers/MovieActivityStoreProvider';
import { useMovieContext } from '@/providers/MovieProvider';

export const MovieActivityStoreSubscriber = () => {
  const { movie } = useMovieContext();

  const subscribe = useMovieActivityStoreSubscribe();

  const initRef = useRef(false);

  if (!initRef.current) {
    initRef.current = true;
    subscribe((state, prevState) => {
      const diffArr = microdiff(prevState, state);

      diffArr.forEach((diff) => {
        if (diff.type === 'CHANGE') {
          if (diff.path[0] === 'liked') {
            trpc.likeMovie.mutate({ movieId: movie.movieId, liked: diff.value });
          }
          if (diff.path[0] === 'rating') {
            trpc.rateMovie.mutate({ movieId: movie.movieId, rating: diff.value });
          }
          if (diff.path[0] === 'watched') {
            trpc.watchMovie.mutate({ movieId: movie.movieId, watched: diff.value });
          }
          // if (diff.path[0] === 'watchlist') {
          //   if (diff.value) {
          //     trpc.addToWatchlist.mutate({ movieId: movie.movieId, userId: 1 });
          //   } else {
          //     trpc.removeFromWatchlist.mutate({ movieId: movie.movieId, userId: 1 });
          //   }
          // }
        }
      });
    });
  }

  return null;
};
