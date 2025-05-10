'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { ListStoreContext } from './list-store.provider';
import { ListStore } from './list-store.types';

export const useListStore = <T>(selector: (store: ListStore) => T): T => {
  const context = useContext(ListStoreContext);

  if (!context) {
    throw new Error(`useListStore must be used within ListStoreProvider`);
  }

  return useStore(context, useShallow(selector));
};
