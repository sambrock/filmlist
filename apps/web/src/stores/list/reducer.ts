import { ListStoreAction, ListStoreState } from './types';

export const reducer = (state: ListStoreState, action: ListStoreAction) => {
  switch (action.type) {
    case 'ADD_MOVIE':
      return state;
    case 'REMOVE_MOVIE': {
      return state;
    }
    default:
      return state;
  }
};
