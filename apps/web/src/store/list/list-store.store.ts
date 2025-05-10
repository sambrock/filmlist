import { createStore } from 'zustand';

import { PatchesStoreActions } from '../patches/patches-store.types';
import { reducer } from './list-store.reducer';
import { ListStore, ListStoreState } from './list-store.types';

export const defaultInitState: ListStoreState = {
  list: {
    listId: -1,
    editId: '',
    readId: '',
    title: 'Untitled',
    description: '',
    locked: false,
    owner: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdate: new Date(),
  },
  movies: new Map(),
};

export const createListStore = (
  pushPatches: PatchesStoreActions['pushPatches'],
  initState: ListStoreState = defaultInitState
) => {
  return createStore<ListStore>()((set) => ({
    ...initState,

    dispatch: (action) => {
      set((state) => {
        const [newState, patches, inversePatches] = reducer(state, action);

        if (typeof patches !== 'undefined' && typeof inversePatches !== 'undefined') {
          pushPatches(patches, inversePatches, set);
        }

        return newState;
      });
    },
  }));
};
