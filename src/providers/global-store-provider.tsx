'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { createGlobalStore, GlobalStore } from '@/stores/global-store';
import { useGetUserQuery } from '@/hooks/useGetUserQuery';

export type GlobalStoreApi = ReturnType<typeof createGlobalStore>;

export const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(undefined);

export const GlobalStoreProvider = (props: React.PropsWithChildren) => {
  const userQuery = useGetUserQuery();

  const storeRef = useRef<GlobalStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createGlobalStore({
      userId: userQuery.data?.userId,
    });
    storeRef.current.subscribe((state) => console.log(state));
  }

  useEffect(() => {
    if (!storeRef.current) return;
    if (!userQuery.data) return;
    storeRef.current.getState().actions.setUserId(userQuery.data.userId);
  }, [userQuery.data]);

  return <GlobalStoreContext.Provider value={storeRef.current}>{props.children}</GlobalStoreContext.Provider>;
};

export const useGlobalStore = <T,>(selector: (store: GlobalStore) => T): T => {
  const context = useContext(GlobalStoreContext);
  if (!context) {
    throw new Error(`useGlobalStore must be used within GlobalStoreProvider`);
  }

  return useStore(context, useShallow(selector));
};
