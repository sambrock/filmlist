'use client';

import { createContext, useRef } from 'react';
import { produce } from 'immer';

import { api } from '@/lib/api';
import { createPatchesStore } from './patches-store.store';

export type PatchesStoreApi = ReturnType<typeof createPatchesStore>;

export const PatchesStoreContext = createContext<PatchesStoreApi | undefined>(undefined);

export const PatchesStoreProvider = (props: React.PropsWithChildren) => {
  const storeRef = useRef<PatchesStoreApi | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!storeRef.current) {
    storeRef.current = createPatchesStore();

    storeRef.current.subscribe((state) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (!storeRef.current) return;
        if (state.buffer.length === 0) return;
        api.POST('/v1/patches/savePatches', { body: state.buffer });
        storeRef.current.setState((state) =>
          produce(state, (draft) => {
            draft.buffer = [];
          })
        );
      }, 300);
    });
  }

  return (
    <PatchesStoreContext.Provider value={storeRef.current}>{props.children}</PatchesStoreContext.Provider>
  );
};
