import { applyPatches, enableMapSet, enablePatches, produce } from 'immer';
import { createStore } from 'zustand';

import { PatchesStore } from './patches-store.types';

enableMapSet();
enablePatches();

export const createPatchesStore = () => {
  return createStore<PatchesStore>()((set) => ({
    patches: [],
    pointer: -1,
    buffer: [],

    pushPatches: (patches, inversePatches, setStore) => {
      set((state) => {
        const newState = produce(state, (draft) => {
          draft.patches.length = state.pointer + 1;
          draft.patches.push([patches, inversePatches, setStore]);
          draft.pointer = state.pointer + 1;
          draft.buffer.push(patches);
        });

        return newState;
      });
    },

    undo: () => {
      set((state) => {
        if (state.pointer < 0) return state;
        const [, inversePatches, setStore] = state.patches[state.pointer];

        setStore((state: any) => applyPatches(state, inversePatches));

        return produce(state, (draft) => {
          draft.pointer = draft.pointer - 1;
          draft.buffer.push(inversePatches);
        });
      });
    },

    redo: () => {
      set((state) => {
        if (state.pointer === state.patches.length - 1) return state;
        const pointer = state.pointer + 1;
        const [patches, , setStore] = state.patches[pointer];

        setStore((state: any) => applyPatches(state, patches));

        return produce(state, (draft) => {
          draft.pointer = pointer;
          draft.buffer.push(patches);
        });
      });
    },
  }));
};
