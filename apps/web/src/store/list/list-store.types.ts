import type { List, ListMovie, Movie } from '@repo/drizzle';

import { ListStoreAction } from './list-store.reducer';

export type ListStoreState = {
  list: List | null;
  movies: Map<number, ListMovie & { movie: Movie }>;
};

export type ListStoreActions = {
  dispatch: (action: ListStoreAction) => void;
};

export type ListStore = ListStoreState & ListStoreActions;
