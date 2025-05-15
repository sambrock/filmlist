import type { List, ListMovie, Movie } from '@repo/drizzle';
import { paths } from '@/lib/api/api-v1';
import { ListStoreAction } from './listStore.reducer';

export type ListStoreInitialData =
  paths['/v1/lists/getInitialData']['get']['responses'][200]['content']['application/json'];

export type ListStoreState = {
  list: List | null;
  listMovies: Set<ListMovie>;
  movies: Map<number, Movie>;
  _isInitialized: boolean;
};

export type ListStoreActions = {
  initializeList: () => Promise<void>;
  dispatch: (action: ListStoreAction) => void;
};

export type ListStore = ListStoreState & ListStoreActions;
