import { Patch, produce, produceWithPatches } from 'immer';

import { List, ListMovie, Movie } from '@repo/drizzle';

import { ListStoreState } from './list-store.types';

export type ListStoreAction =
  | {
      type: 'INITIALIZE_LIST';
      payload: {
        list: List;
        movies: Map<number, ListMovie & { movie: Movie }>;
      };
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
          draft.list = action.payload.list;
          draft.movies = action.payload.movies;
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
        const order = draft.movies.size + 1;
        console.log()

        draft.movies.set(action.payload.movieId, {
          listId: draft.list?.listId || 1,
          movieId: action.payload.movieId,
          createdAt: new Date(),
          order,
          movie: action.payload,
        });
      });
    }

    default:
      return [state];
  }
};
