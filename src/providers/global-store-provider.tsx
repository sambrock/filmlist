'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { User } from '@/lib/auth';
import { createGlobalStore, GlobalStore } from '@/stores/global-store';

export type GlobalStoreApi = ReturnType<typeof createGlobalStore>;

export const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(undefined);

type Props = {
  user: User;
};

export const GlobalStoreProvider = ({ user, ...props }: React.PropsWithChildren<Props>) => {
  const storeRef = useRef<GlobalStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createGlobalStore({ user });
  }

  return <GlobalStoreContext.Provider value={storeRef.current}>{props.children}</GlobalStoreContext.Provider>;
};

export const useGlobalStore = <T,>(selector: (store: GlobalStore) => T): T => {
  const context = useContext(GlobalStoreContext);
  if (!context) {
    throw new Error(`useGlobalStore must be used within GlobalStoreProvider`);
  }

  return useStore(context, useShallow(selector));
};
