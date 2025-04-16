import { enableMapSet, enablePatches } from 'immer';
import { create } from 'zustand';

import type { List, ListMovie, Movie } from '@filmlist/drizzle';
import { createPatches } from '../usePatchesStore/usePatchesStore.store';
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
        const newState = reducer(state, action);

        if (action.type === 'ADD_MOVIE' || action.type === 'REMOVE_MOVIE') {
          createPatches('list_store', state, newState);
        }

        return newState;
      });
    },
  },
}));
