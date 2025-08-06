'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { ClientStore, createClientStore, InitClientState } from '@/stores/client-store';

export type ClientStoreApi = ReturnType<typeof createClientStore>;

export const ClientStoreContext = createContext<ClientStoreApi | undefined>(undefined);

export const ClientStoreProvider = ({
  initialState,
  ...props
}: React.PropsWithChildren<{ initialState?: InitClientState }>) => {
  const storeRef = useRef<ClientStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createClientStore(initialState);
    storeRef.current.subscribe((state) => console.log('client', state));
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

export const useClientStoreUserId = () => {
  return useClientStore((store) => store.userId);
};

export const useClientStoreThreadId = () => {
  return useClientStore((store) => store.threadId);
};

export const useClientStoreSetThreadId = (threadId: string) => {
  const setThreadId = useClientStore((s) => s.actions.setThreadId);

  const initRef = useRef(false);
  if (!initRef.current) {
    initRef.current = true;
    setThreadId(threadId);
  }
};

export const useClientStoreActions = () => {
  return useClientStore((store) => store.actions);
};
