'use client';

import { createContext, Fragment, useRef } from 'react';

import { useGlobalStore } from './global-store.hooks';
import { createGlobalStore } from './global-store.store';
import { GlobalStoreState } from './global-store.types';

export type GlobalStoreApi = ReturnType<typeof createGlobalStore>;

export const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(undefined);

export const GlobalStoreProvider = (props: React.PropsWithChildren) => {
  const storeRef = useRef<GlobalStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createGlobalStore();
  }

  return <GlobalStoreContext.Provider value={storeRef.current}>{props.children}</GlobalStoreContext.Provider>;
};

export const GlobalStoreInitializer = ({
  initialData,
  ...props
}: React.PropsWithChildren<{ initialData: Partial<GlobalStoreState> }>) => {
  const initializeGlobalStore = useGlobalStore((s) => s.initialize);

  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    initializeGlobalStore(initialData);

    isInitialized.current = true;
  }

  return <Fragment>{props.children}</Fragment>;
};
