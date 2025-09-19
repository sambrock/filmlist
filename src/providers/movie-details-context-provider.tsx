'use client';

import { createContext, useContext } from 'react';

export type MovieDetailsContext = {
  isIntercepted: boolean;
};

export const MovieDetailsContext = createContext<MovieDetailsContext | undefined>(undefined);

export const MovieDetailsContextProvider = ({
  isIntercepted,
  ...props
}: React.PropsWithChildren<{ isIntercepted: boolean }>) => {
  return (
    <MovieDetailsContext.Provider value={{ isIntercepted }}>{props.children}</MovieDetailsContext.Provider>
  );
};

export const useMovieDetailsContext = () => {
  const context = useContext(MovieDetailsContext);
  if (!context) {
    throw new Error(`useMovieDetailsContext must be used within MovieDetailsContextProvider`);
  }

  return context;
};
