import { applyPatches, enableMapSet, enablePatches, produce } from 'immer';
import { createStore } from 'zustand';

import { PatchesStore } from './patches-store.types';

enableMapSet();
enablePatches();

export const createPatchesStore = () => {
  return createStore<PatchesStore>()((set) => ({
    patches: [],
    pointer: -1,

    pushPatches: (store, patches, inversePatches) => {
      set((state) => {
        const newState = produce(state, (draft) => {
          draft.patches.length = state.pointer + 1;
          draft.patches.push([store, patches, inversePatches]);
          draft.pointer = state.pointer + 1;
        });

        return newState;
      });
    },

    undo: () => {
      set((state) => {
        if (state.pointer < 0) return state;
        const [, inversePatches, set] = state.patches[state.pointer];

        set((state: any) => applyPatches(state, inversePatches));

        return produce(state, (draft) => {
          draft.pointer = draft.pointer - 1;
        });
      });
    },

    redo: () => {
      set((state) => {
        if (state.pointer === state.patches.length - 1) return state;
        const pointer = state.pointer + 1;
        const [patches, , set] = state.patches[pointer];

        set((state: any) => applyPatches(state, patches));

        return produce(state, (draft) => {
          draft.pointer = pointer;
        });
      });
    },
  }));
};
