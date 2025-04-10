import { ListStore, ListStoreActions } from './types';

export const reducer = (state: ListStore, action: ListStoreActions) => {
  switch (action.type) {
    case 'ADD_MOVIE':
      return {
        ...state,
        movies: [...state.movies, action.payload],
      };
    case 'REMOVE_MOVIE':
      return {
        ...state,
        movies: state.movies.filter((movie) => movie.movieId !== action.payload.movieId),
      };
    default:
      return state;
  }
};
