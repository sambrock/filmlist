import { produce, produceWithPatches, applyPatches } from 'immer';

import type { GlobalStoreAction, GlobalStoreState } from './types';

export const reducer = (state: GlobalStoreState, action: GlobalStoreAction): GlobalStoreState => {
  switch (action.type) {
    case 'INITIALIZE_LIST': {
      return produce(state, (draft) => {
        draft.data.list = action.payload.list;
        draft.data.movies = action.payload.movies;
      });
    }
    case 'ADD_MOVIE': {
      const [newState, patches, inverse] = produceWithPatches(state, (draft) => {
        const { tmdbId, title, posterPath } = action.payload;
        const order = draft.data.movies.size + 1;

        draft.data.movies.set(tmdbId, {
          tmdbId,
          title,
          posterPath,
          order,
        });
      });

      return {
        ...newState,
        patches: [...state.patches, patches],
        inversePatches: [...state.inversePatches, inverse],
        pointer: state.pointer + 1,
      };
    }
    case 'REMOVE_MOVIE': {
      return state;
    }
    case 'UNDO': {
      if (state.pointer === 0) {
        return state;
      }

      const newPointer = state.pointer - 1;
      const inversePatches = state.inversePatches[newPointer];

      const newState = applyPatches(state, inversePatches);

      return {
        ...newState,
        patches: state.patches.slice(0, newPointer),
        inversePatches: state.inversePatches.slice(0, newPointer),
        pointer: newPointer,
      };
    }
    case 'REDO': {
      if (state.pointer === state.patches.length) {
        return state;
      }

      const newPointer = state.pointer + 1;
      const patches = state.patches[newPointer];

      const newState = applyPatches(state, patches);

      return {
        ...newState,
        patches: state.patches.slice(0, newPointer),
        inversePatches: state.inversePatches.slice(0, newPointer),
        pointer: newPointer,
      };
    }
    default:
      return state;
  }
};
