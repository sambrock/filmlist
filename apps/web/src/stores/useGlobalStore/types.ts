import { Patch } from 'immer';

import { List } from '@filmlist/drizzle';

export type GlobalStore = GlobalStoreState & { actions: GlobalStoreActions };

export type GlobalStoreState = {
  data: {
    list: List | undefined;
    movies: Map<number, { tmdbId: number; title: string; posterPath: string; order: number }>;
  };

  patches: Patch[][];
  inversePatches: Patch[][];
  pointer: number;
};

export type GlobalStoreActions = {
  dispatch: (action: GlobalStoreAction) => void;
};

export type GlobalStoreAction =
  | {
      type: 'INITIALIZE_LIST';
      payload: {
        list: List;
        movies: Map<number, { tmdbId: number; title: string; posterPath: string; order: number }>;
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
