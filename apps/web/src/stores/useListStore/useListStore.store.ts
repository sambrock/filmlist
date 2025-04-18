import { enableMapSet, enablePatches } from 'immer';
import { create } from 'zustand';

import type { List, ListMovie, Movie } from '@repo/drizzle';
import { pushPatches } from '../usePatchesStore/usePatchesStore.store';
import { ListStoreAction, reducer } from './useListStore.reducer';

enableMapSet();
enablePatches();

export type ListStoreState = {
  list: List;
  movies: Map<number, ListMovie & { movie: Partial<Movie> }>;
};

export type ListStoreActions = {
  dispatch: (action: ListStoreAction) => void;
};

export type ListStore = ListStoreState & { actions: ListStoreActions };

export const useListStore = create<ListStore>((set) => ({
  list: undefined as unknown as List,
  movies: new Map(),

  actions: {
    dispatch: (action) => {
      set((state) => {
        const [newState, patches, inversePatches] = reducer(state, action);

        if (typeof patches !== 'undefined' && typeof inversePatches !== 'undefined') {
          pushPatches('list_store', patches, inversePatches);
        }

        return newState;
      });
    },
  },
}));
