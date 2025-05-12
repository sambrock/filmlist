import { Patch, produce, produceWithPatches } from 'immer';

import { List, Movie } from '@repo/drizzle';
import { ListStoreState } from './listStore.types';

export type ListStoreAction =
  | {
      type: 'INITIALIZE_LIST';
      payload: List;
    }
  | {
      type: 'SET_TITLE';
      payload: string;
    }
  | {
      type: 'ADD_MOVIE';
      payload: Movie;
    }
  | {
      type: 'REMOVE_MOVIE';
      payload: {
        movieId: number;
      };
    };

export const reducer = (
  state: ListStoreState,
  action: ListStoreAction
): [ListStoreState] | readonly [ListStoreState, Patch[], Patch[]] => {
  switch (action.type) {
    case 'INITIALIZE_LIST': {
      return [
        produce(state, (draft) => {
          draft.list = action.payload;
          draft._isInitialized = true;
        }),
      ];
    }
    case 'SET_TITLE': {
      return produceWithPatches(state, (draft) => {
        draft.list!.title = action.payload;
      });
    }
    case 'ADD_MOVIE': {
      return produceWithPatches(state, (draft) => {
        draft.movies.set(action.payload.movieId, action.payload);
        draft.listMovies.add({
          listId: draft.list.listId,
          movieId: action.payload.movieId,
          createdAt: new Date(),
          order: draft.listMovies.size + 1,
        });
      });
    }
    default:
      return [state];
  }
};
