'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { createGlobalStore, GlobalStore } from '@/stores/global-store';

export type GlobalStoreApi = ReturnType<typeof createGlobalStore>;

export const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(undefined);

export const GlobalStoreProvider = (props: React.PropsWithChildren) => {
  const storeRef = useRef<GlobalStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createGlobalStore();
    storeRef.current.subscribe((state) => console.log(state));
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
