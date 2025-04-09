import { useQuery } from '@tanstack/react-query';

import { trpc } from '@/lib/trpc';

export const MovieSearch = () => {
  const searchQuery = useQuery({ queryKey: ['todos'], queryFn: trpc.searchMovies});

  return <input />;
};
