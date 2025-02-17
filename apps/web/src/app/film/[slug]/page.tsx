import { notFound } from 'next/navigation';
import { hc } from 'hono/client';

import type { AppType } from '@repo/api';
import { MovieView } from '@/components/views/MovieView';

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

  const client = hc<AppType>('http://localhost:8787');

  const movie = await client.api.movie[':movieId']
    .$get({ param: { movieId: movieId.toString() } })
    .then((res) => res.json());

  return <MovieView movie={movie} />;
}

// Popularity
// Average rating
// Seen / watched
// Number of lists
// Rotten tomatoes score?

// Streaming options
