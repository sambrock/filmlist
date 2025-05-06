import { createStore } from 'zustand';

import { GlobalStore, GlobalStoreState } from './global-store.types';

export const defaultInitState: GlobalStoreState = {
  clientId: null,
};

export const createGlobalStore = (initState: GlobalStoreState = defaultInitState) => {
  return createStore<GlobalStore>()((set) => ({
    ...initState,

    initialize: (state: Partial<GlobalStoreState>) => {
      set((s) => ({
        ...s,
        ...state,
      }));
    },
  }));
};
