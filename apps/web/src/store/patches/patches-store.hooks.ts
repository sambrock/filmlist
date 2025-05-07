'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { PatchesStoreContext } from './patches-store.provider';
import { PatchesStore } from './patches-store.types';

export const usePatchesStore = <T>(selector: (store: PatchesStore) => T): T => {
  const context = useContext(PatchesStoreContext);

  if (!context) {
    throw new Error(`usePatchesStore must be used within PatchesStoreProvider`);
  }

  return useStore(context, useShallow(selector));
};
