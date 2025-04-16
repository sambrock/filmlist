import { produce } from 'immer';

import { List, ListMovie, Movie } from '@filmlist/drizzle';
import { ListStoreState } from './useListStore.store';

export type ListStoreAction =
  | {
      type: 'INITIALIZE_LIST';
      payload: {
        list: List;
        movies: Map<number, ListMovie & { movie: Movie }>;
      };
    }
  | {
      type: 'ADD_MOVIE';
      payload: {
        tmdbId: number;
        title: string;
        posterPath: string;
      };
    }
  | {
      type: 'REMOVE_MOVIE';
      payload: {
        movieId: number;
      };
    }
  | { type: 'UNDO' }
  | { type: 'REDO' };

export const reducer = (state: ListStoreState, action: ListStoreAction): ListStoreState => {
  switch (action.type) {
    case 'INITIALIZE_LIST': {
      return produce(state, (draft) => {
        draft.list = action.payload.list;
        draft.movies = action.payload.movies;
      });
    }

    case 'ADD_MOVIE': {
      return produce(state, (draft) => {
        const { tmdbId, title, posterPath } = action.payload;
        const order = draft.movies.size + 1;

        draft.movies.set(tmdbId, {
          listId: draft.list.listId,
          movieId: tmdbId,
          createdAt: new Date(),
          order,
          movie: {
            movieId: tmdbId, // Temp
            tmdbId: tmdbId,
            posterPath,
            title,
          },
        });
      });
    }

    default:
      return state;
  }
};
