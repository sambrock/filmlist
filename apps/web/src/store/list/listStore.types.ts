import type { List, ListMovie, Movie } from '@repo/drizzle';
import { ListStoreAction } from './listStore.reducer';

export type ListStoreState = {
  list: List;
  listMovies: Set<ListMovie>;
  movies: Map<number, Movie>;

  _isInitialized: boolean;
};

export type ListStoreActions = {
  initializeList: () => Promise<void>;
  dispatch: (action: ListStoreAction) => void;
};

export type ListStore = ListStoreState & ListStoreActions;
