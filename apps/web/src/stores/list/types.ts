export type ListStore = {
  list: unknown;
  movies: unknown[];

  dispatch: (action: ListStoreActions) => void;
};

export type ListStoreActions =
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
