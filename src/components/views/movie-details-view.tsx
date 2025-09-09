'use client';

import { backdropSrc } from '@/lib/utils/movie';
import { useApiMovieDetails } from '@/hooks/use-api-movie-details';

type Props = {
  movieId: number;
};

export const MovieDetailsView = ({ movieId }: Props) => {
  const { movie } = useApiMovieDetails(movieId);

  if (!movie) {
    return null;
  }
  return (
    <div>
      <div className="relative">
        <img className="object-fit brightness-90" src={backdropSrc(movie.backdrop_path!, 'w1280')} />
        <div className="to-background-1 absolute bottom-0 h-96 w-full bg-linear-to-b from-transparent" />
      </div>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
    </div>
  );
};
