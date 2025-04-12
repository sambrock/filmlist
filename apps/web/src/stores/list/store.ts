import { enableMapSet, enablePatches } from 'immer';
import { createStore } from 'zustand';

import { reducer } from './reducer';
import type { ListStoreActions, ListStoreState } from './types';

enableMapSet();
enablePatches();

export const createListStore = () => {
  return createStore<ListStoreState & { actions: ListStoreActions }>((set) => ({
    list: {},
    movies: new Map(),

    actions: {
      dispatch: (args) => set((state) => reducer(state, args)),
    },
  }));
};
