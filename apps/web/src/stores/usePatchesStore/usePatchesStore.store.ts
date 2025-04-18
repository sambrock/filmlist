import { type Patch, applyPatches, enableMapSet, enablePatches, produce } from 'immer';
import { create } from 'zustand';

import { saveListPatches } from '../../lib/api/savePatches';
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
  pushPatches: (store: Store, patches: Patch[], inversePatches: Patch[]) => void;
};

export type PatchesStore = PatchesStoreState & { actions: PatchesStoreActions };

export const usePatchesStore = create<PatchesStore>((set) => ({
  patches: [],
  pointer: -1,

  actions: {
    pushPatches: (store, patches, inversePatches) => {
      set((state) => {
        const newState = produce(state, (draft) => {
          draft.patches.length = state.pointer + 1;
          draft.patches.push([store, patches, inversePatches]);
          draft.pointer = state.pointer + 1;
        });

        if (store === 'list_store') {
          saveListPatches(useListStore.getState(), patches);
        }

        return newState;
      });
    },

    undo: () => {
      set((state) => {
        if (state.pointer < 0) return state;
        const [store, , inversePatches] = state.patches[state.pointer];

        if (store === 'list_store') {
          useListStore.setState((s) => applyPatches(s, inversePatches));
          saveListPatches(useListStore.getState(), inversePatches);
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
          saveListPatches(useListStore.getState(), patches);
        }

        return produce(state, (draft) => {
          draft.pointer = pointer;
        });
      });
    },
  },
}));

export const { pushPatches, undo, redo } = usePatchesStore.getState().actions;
