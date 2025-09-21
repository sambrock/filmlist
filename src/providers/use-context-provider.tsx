'use client';

import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from 'usehooks-ts';

import type { User } from '@/lib/auth';

export type UserContext = {
  userId: string;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export const UserContextProvider = (props: React.PropsWithChildren) => {
  const [localStorageUser, setLocalStorageUser] = useLocalStorage<User>('fc/user', {
    userId: '',
    anon: true,
  });

  useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (localStorageUser.userId) {
        return localStorageUser;
      }

      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        throw new Error('Failed to fetch user');
      }

      const user = await res.json();
      setLocalStorageUser(user);

      return user as User;
    },
  });

  return (
    <UserContext.Provider value={{ userId: localStorageUser.userId }}>{props.children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(`useUserContext must be used within UserContextProvider`);
  }

  return context;
};
