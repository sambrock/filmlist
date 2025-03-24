import { notFound } from 'next/navigation';

import { trpc } from '@/lib/trpc';
import { MovieView } from '@/components/views/MovieView/MovieView';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MoviePage(props: Props) {
  const params = await props.params;

  const movieId = parseInt(params.slug.split('-')[0]);
  if (!movieId) {
    notFound();
  }

  const [movie, initialActivity] = await Promise.all([
    trpc.getMovie.query({ movieId }),
    trpc.getUserMovieActivity.query({ movieId }),
  ]);

  console.log('MOVIE', movie);

  return <MovieView movie={movie} initialActivity={initialActivity} />;
}

// Popularity
// Average rating
// Seen / watched
// Number of lists
// Rotten tomatoes score?

// Streaming options
