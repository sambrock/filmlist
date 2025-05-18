'use client';

import { createContext, useRef } from 'react';

import { usePatchesStore } from '../patches';
import { createListStore } from './listStore.store';
import { ListStoreInitialData } from './listStore.types';

export type ListStoreApi = ReturnType<typeof createListStore>;

export const ListStoreContext = createContext<ListStoreApi | undefined>(undefined);

type Props = {
  initialData?: ListStoreInitialData;
};

export const ListStoreProvider = ({ initialData, ...props }: React.PropsWithChildren<Props>) => {
  const pushPatches = usePatchesStore((state) => state.pushPatches);

  const storeRef = useRef<ListStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createListStore(pushPatches, initialData);
  }

  return <ListStoreContext.Provider value={storeRef.current}>{props.children}</ListStoreContext.Provider>;
};
