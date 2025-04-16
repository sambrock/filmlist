import { applyPatches, enableMapSet, enablePatches, Patch, produce, produceWithPatches } from 'immer';
import { create } from 'zustand';

import { useListStore } from '../useListStore';

enableMapSet();
enablePatches();

type Store = 'list_store';

export type PatchesStoreState = {
  patches: [Store, Patch[], Patch[]][]; // [patches, inverse]
  pointer: number;
};

export type PatchesStoreActions = {
  undo: () => void;
  redo: () => void;
  createPatches: (store: Store, prevState: unknown, newState: unknown) => void;
};

export type PatchesStore = PatchesStoreState & { actions: PatchesStoreActions };

export const usePatchesStore = create<PatchesStore>((set) => ({
  patches: [],
  pointer: -1,

  actions: {
    createPatches: (store, prevState, nextState) => {
      set((state) =>
        produce(state, (draft) => {
          const [, patches, inversePatches] = produceWithPatches(prevState, (d) => (d = nextState));
          draft.patches.length = state.pointer + 1;
          draft.patches = [...draft.patches, [store, patches, inversePatches]];
          draft.pointer = state.pointer + 1;
        })
      );
    },

    undo: () => {
      set((state) => {
        if (state.pointer < 0) return state;
        const [store, , inversePatches] = state.patches[state.pointer];

        if (store === 'list_store') {
          useListStore.setState((s) => applyPatches(s, inversePatches));
        }

        return produce(state, (draft) => {
          draft.pointer = draft.pointer - 1;
        });
      });
    },

    redo: () => {
      set((state) => {
        if (state.pointer === state.patches.length - 1) return state;
        const pointer = state.pointer + 1;
        const [store, patches] = state.patches[pointer];

        if (store === 'list_store') {
          useListStore.setState((s) => applyPatches(s, patches));
        }

        return produce(state, (draft) => {
          draft.pointer = pointer;
        });
      });
    },
  },
}));

export const { createPatches, undo, redo } = usePatchesStore.getState().actions;

usePatchesStore.subscribe((state) => console.log('patches-store', state.patches, state.pointer));
