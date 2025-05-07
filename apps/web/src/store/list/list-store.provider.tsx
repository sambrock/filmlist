'use client';

import { createContext, useRef } from 'react';

import { usePatchesStore } from '../patches';
import { createListStore } from './list-store.store';

export type ListStoreApi = ReturnType<typeof createListStore>;

export const ListStoreContext = createContext<ListStoreApi | undefined>(undefined);

export const ListStoreProvider = (props: React.PropsWithChildren) => {
  const pushPatches = usePatchesStore((state) => state.pushPatches);
  
  const storeRef = useRef<ListStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createListStore(pushPatches);
  }

  return <ListStoreContext.Provider value={storeRef.current}>{props.children}</ListStoreContext.Provider>;
};
