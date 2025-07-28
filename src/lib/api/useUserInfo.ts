import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '../trpc';

export const useUserInfo = () => {
  const trpc = useTRPC();

  return useQuery(trpc.getUserInfo.queryOptions(undefined, {}));
};
