import { createStore } from 'zustand';

import { GlobalStore, GlobalStoreState } from './global-store.types';

export const defaultInitState: GlobalStoreState = {
  clientId: null,
  initialListId: null,
  isInitialized: false,
};

export const createGlobalStore = (initState: GlobalStoreState = defaultInitState) => {
  return createStore<GlobalStore>()((set) => ({
    ...initState,

    update: (state: Partial<GlobalStoreState>) => {
      set((s) => ({
        ...s,
        ...state,
      }));
    },
  }));
};
