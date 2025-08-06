import { useEffect } from 'react';

import { useClientStoreActions } from '@/providers/client-store-provider';
import { trpc } from '../trpc/client';

export const useAuthMe = () => {
  const { setUserId } = useClientStoreActions();

  const query = trpc.getAuthMe.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (query.data) {
      setUserId(query.data.userId);
    }
  }, [query.data]);

  return query;
};
