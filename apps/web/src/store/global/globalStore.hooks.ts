'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';

import { GlobalStoreContext } from './globalStore.provider';
import { GlobalStore } from './globalStore.types';

export const useGlobalStore = <T>(selector: (store: GlobalStore) => T): T => {
  const context = useContext(GlobalStoreContext);

  if (!context) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(context, selector);
};
