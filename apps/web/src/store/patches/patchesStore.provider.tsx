'use client';

import { createContext, useRef } from 'react';

import { api } from '@/lib/api';
import { usePatchesContext } from './patchesStore.hooks';
import { createPatchesStore } from './patchesStore.store';

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

export const PatchesStoreQueueManager = () => {
  const store = usePatchesContext();

  const isInitializedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!isInitializedRef.current) {
    store.subscribe((state) => {
      if (state.queue.length === 0) {
        return;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        api.POST('/v1/patches/savePatches', {
          body: state.queue,
        });
        state.clearQueue();
      }, 1000);
    });
  }

  return null;
};
