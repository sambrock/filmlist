import { produce } from 'immer';
import { createStore } from 'zustand';

import { api } from '@/lib/api';
import { PatchesStoreActions } from '../patches/patchesStore.types';
import { reducer } from './listStore.reducer';
import { ListStore } from './listStore.types';

const DEFAULT_LIST = {
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
};

export const createListStore = (pushPatches: PatchesStoreActions['pushPatches']) => {
  return createStore<ListStore>()((set, get) => ({
    list: DEFAULT_LIST,
    listMovies: new Set(),
    movies: new Map(),

    _isInitialized: false,

    initializeList: async () => {
      const { data } = await api.POST('/v1/lists/initializeList');
      if (!data) return;

      set((state) =>
        produce(state, (draft) => {
          draft._isInitialized = true;
          draft.list = {
            listId: data.listId,
            editId: data.editId,
            readId: data.readId,
            title: data.title,
            description: data.description,
            locked: data.locked,
            owner: data.owner,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            lastUpdate: new Date(data.lastUpdate),
          };
        })
      );
    },

    dispatch: async (action) => {
      const state = get();
      if (!state._isInitialized) {
        await state.initializeList();
      }

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
