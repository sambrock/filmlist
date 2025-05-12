'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { ListStoreContext } from './listStore.provider';
import { ListStore } from './listStore.types';

export const useListStore = <T>(selector: (store: ListStore) => T): T => {
  const context = useContext(ListStoreContext);

  if (!context) {
    throw new Error(`useListStore must be used within ListStoreProvider`);
  }

  return useStore(context, useShallow(selector));
};
