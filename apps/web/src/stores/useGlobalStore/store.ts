import { applyPatches, enableMapSet, enablePatches } from 'immer';
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

  patches: {
    stack: [],
    pointer: 0,
  },

  actions: {
    dispatch: (args) => set((state) => reducer(state, args)),

    undo: () => {
      set((state) => {
        if (state.patches.pointer < 0) return state;

        const pointer = state.patches.pointer - 1;
        const [, inversePatches] = state.patches.stack[pointer];

        const newState = applyPatches(state, inversePatches);

        return {
          ...newState,
          patches: {
            ...newState.patches,
            pointer,
          },
        };
      });
    },

    redo: () => {
      set((state) => {
        console.log('REDO', state.patches.pointer, state.patches.stack.length);
        if (state.patches.pointer >= state.patches.stack.length) return state;

        console.log('do redo');

        const [patches] = state.patches.stack[state.patches.pointer];
        console.log('APPLY PATCHES', patches);

        const newState = applyPatches(state, patches);

        return {
          ...newState,
          patches: {
            ...newState.patches,
            pointer: state.patches.pointer + 1,
          },
        };
      });
    },
  },
}));

export const { dispatch } = useGlobalStore.getState().actions;

export const useListMovies = () => useGlobalStore(useShallow((state) => state.data.movies));

useGlobalStore.subscribe((state) => console.log(state.patches));
