import { produce, produceWithPatches, applyPatches, Patch } from 'immer';

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
      return returnStateWithPatches(
        produceWithPatches(state, (draft) => {
          const { tmdbId, title, posterPath } = action.payload;
          const order = draft.data.movies.size + 1;

          draft.data.movies.set(tmdbId, {
            tmdbId,
            title,
            posterPath,
            order,
          });
        })
      );
    }
    case 'REMOVE_MOVIE': {
      return state;
    }
    default:
      return state;
  }
};

const returnStateWithPatches = (data: readonly [GlobalStoreState, Patch[], Patch[]]): GlobalStoreState => {
  const [newState, patches, inversePatches] = data;

  return {
    ...newState,
    patches: {
      stack: [...newState.patches.stack, [patches, inversePatches]],
      pointer: newState.patches.pointer + 1,
    },
  };
};
