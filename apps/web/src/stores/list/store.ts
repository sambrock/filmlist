import { createStore } from 'zustand';

import { reducer } from './reducer';
import type { ListStore } from './types';

export const createListStore = () => {
  return createStore<ListStore>((set) => ({
    list: {},
    movies: [],

    dispatch: (args) => set((state) => reducer(state, args)),
  }));
};
