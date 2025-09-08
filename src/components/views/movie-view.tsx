'use client';

import { useApiMovieDetails } from '@/hooks/use-api-movie-details';
import { ModalContent, ModalDescription, ModalTitle } from '../common/modal';

type Props = {
  movieId: number;
};

export const MovieView = ({ movieId }: Props) => {
  const { movie } = useApiMovieDetails(movieId);

  if (!movie) {
    return null;
  }
  return (
    <ModalContent>
      <ModalTitle className="sr-only">{movie.title}</ModalTitle>
      <ModalDescription className="sr-only">{movie.title} details</ModalDescription>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
    </ModalContent>
  );
};
