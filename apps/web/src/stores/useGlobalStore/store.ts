import { enableMapSet, enablePatches } from 'immer';
import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { reducer } from './reducer';
import type { GlobalStore } from './types';

enableMapSet();
enablePatches();

export const useGlobalStore = create<GlobalStore>((set) => ({
  data: {
    list: undefined,
    movies: new Map(),
  },

  patches: [],
  inversePatches: [],
  pointer: 0,

  actions: {
    dispatch: (args) => set((state) => reducer(state, args)),
  },
}));

export const { dispatch } = useGlobalStore.getState().actions;

export const useListMovies = () => useGlobalStore(useShallow((state) => state.data.movies));
