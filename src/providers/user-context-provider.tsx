'use client';

import { createContext, useContext } from 'react';

import { trpc } from '@/lib/trpc/client';

export const UserContext = createContext<{ userId: string } | undefined>(undefined);

export const UserContextProvider = (props: React.PropsWithChildren) => {
  const { data } = trpc.getUser.useQuery(undefined, {
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return <UserContext.Provider value={{ userId: data?.userId || '' }}>{props.children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(`useUserContext must be used within UserContextProvider`);
  }

  return context;
};
