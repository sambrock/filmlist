'use client';

import { createContext, useContext } from 'react';

import { useUserQuery } from '@/lib/api/useUserQuery';
import { User } from '@/lib/auth';

const UserContext = createContext<{ user?: User } | undefined>(undefined);

type Props = {
  user?: User;
};

export const UserContextProvider = (props: React.PropsWithChildren<Props>) => {
  const userQuery = useUserQuery(props.user);

  return <UserContext.Provider value={{ user: userQuery.data! }}>{props.children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
