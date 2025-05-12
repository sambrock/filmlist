'use client';

import { createContext, Fragment, useRef } from 'react';

import { useGlobalStore } from './globalStore.hooks';
import { createGlobalStore } from './globalStore.store';
import { GlobalStoreState } from './globalStore.types';

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
  const updateGlobalStore = useGlobalStore((s) => s.update);

  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    updateGlobalStore(initialData);

    isInitialized.current = true;
  }

  return <Fragment>{props.children}</Fragment>;
};
