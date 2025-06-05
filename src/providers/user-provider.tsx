'use client';

import { createContext, useContext } from 'react';

type UserContext = {
  userId: string;
  anon: boolean;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export const UserProvider = (props: React.PropsWithChildren<UserContext>) => {
  const { userId, anon } = props;

  return <UserContext.Provider value={{ userId, anon }}>{props.children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
