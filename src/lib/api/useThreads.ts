import { useQuery } from '@tanstack/react-query';

import { trpc } from '../trpc';

export const useThreads = () => {
  return useQuery({
    queryKey: ['threads'],
    queryFn: () => trpc.getUserThreads.query(),
  });
};
