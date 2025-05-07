'use client';

import { createContext, useRef } from 'react';

import { createPatchesStore } from './patches-store.store';

export type PatchesStoreApi = ReturnType<typeof createPatchesStore>;

export const PatchesStoreContext = createContext<PatchesStoreApi | undefined>(undefined);

export const PatchesStoreProvider = (props: React.PropsWithChildren) => {
  const storeRef = useRef<PatchesStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createPatchesStore();
  }

  return (
    <PatchesStoreContext.Provider value={storeRef.current}>{props.children}</PatchesStoreContext.Provider>
  );
};
