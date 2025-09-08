import { trpc } from '@/lib/trpc/client';

export const useApiMovieDetails = (movieId: number) => {
  const query = trpc.getMovie.useQuery(
    { movieId },
    {
      retryOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  return { ...query, movie: query.data?.movie || null };
};
