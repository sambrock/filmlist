import { MovieDetailsView } from '@/components/views/movie-details-view';

type Props = {
  params: Promise<{ movie_id: string }>;
};

export default async function MoviePage({ params }: Props) {
  const { movie_id } = await params;

  return <MovieDetailsView movieId={Number(movie_id)} isIntercepted={false} />;
}
