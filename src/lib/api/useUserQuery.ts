import { useQuery } from '@tanstack/react-query';

import { User } from '../auth';
import { trpc } from '../trpc';

export const useUserQuery = (initialData?: User) => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => trpc.getUser.query(),
    initialData,
  });
};
