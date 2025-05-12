'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { PatchesStoreContext } from './patchesStore.provider';
import { PatchesStore } from './patchesStore.types';

export const usePatchesContext = () => {
  const context = useContext(PatchesStoreContext);
  if (!context) {
    throw new Error(`usePatchesContext must be used within PatchesStoreProvider`);
  }
  return context;
};

export const usePatchesStore = <T>(selector: (store: PatchesStore) => T): T => {
  const context = useContext(PatchesStoreContext);
  if (!context) {
    throw new Error(`usePatchesStore must be used within PatchesStoreProvider`);
  }
  return useStore(context, useShallow(selector));
};
