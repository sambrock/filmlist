'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';

import { GlobalStoreContext } from './global-store.provider';
import { GlobalStore } from './global-store.types';

export const useGlobalStore = <T>(selector: (store: GlobalStore) => T): T => {
  const context = useContext(GlobalStoreContext);

  if (!context) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(context, selector);
};
