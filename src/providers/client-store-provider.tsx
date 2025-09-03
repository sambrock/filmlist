'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { ClientStore, createClientStore } from '@/stores/client-store';

export type ClientStoreApi = ReturnType<typeof createClientStore>;

export const ClientStoreContext = createContext<ClientStoreApi | undefined>(undefined);

export const ClientStoreProvider = (props: React.PropsWithChildren) => {
  const storeRef = useRef<ClientStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createClientStore();
    storeRef.current.subscribe((state) => console.log(state));
  }

  return <ClientStoreContext.Provider value={storeRef.current}>{props.children}</ClientStoreContext.Provider>;
};

export const useClientStore = <T,>(selector: (store: ClientStore) => T): T => {
  const context = useContext(ClientStoreContext);
  if (!context) {
    throw new Error(`useClientStore must be used within ClientStoreProvider`);
  }

  return useStore(context, useShallow(selector));
};
