export type ListStoreState = {
  list: unknown;
  movies: Map<number, { title: string }>;
};

export type ListStoreActions = {
  dispatch: (action: ListStoreAction) => void;
};

export type ListStoreAction =
  | {
      type: 'ADD_MOVIE';
      payload: {
        movieId: number;
        title: string;
      };
    }
  | {
      type: 'REMOVE_MOVIE';
      payload: {
        movieId: number;
      };
    };
