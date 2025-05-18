import { produce } from 'immer';
import { createStore } from 'zustand';

import { api } from '@/lib/api/client';
import { PatchesStoreActions } from '../patches/patchesStore.types';
import { reducer } from './listStore.reducer';
import { ListStore, ListStoreInitialData } from './listStore.types';

export const createListStore = (
  pushPatches: PatchesStoreActions['pushPatches'],
  initialData?: ListStoreInitialData
) => {
  return createStore<ListStore>()((set, get) => ({
    list: initialData
      ? {
          ...initialData.list,
          createdAt: new Date(initialData.list.createdAt),
          updatedAt: new Date(initialData.list.updatedAt),
          lastUpdate: new Date(initialData.list.lastUpdate),
        }
      : null,
    movies: initialData
      ? new Map(
          initialData.movies.map((movie) => [
            movie.movieId,
            {
              ...movie,
              createdAt: new Date(movie.createdAt),
            },
          ])
        )
      : new Map(),
    listMovies: initialData
      ? new Set(
          initialData.listMovies.map((listMovie) => ({
            ...listMovie,
            createdAt: new Date(listMovie.createdAt),
          }))
        )
      : new Set(),

    _isInitialized: initialData ? true : false,

    initializeList: async () => {
      const { data } = await api.POST('/v1/lists/initializeList', { credentials: 'include' });
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
