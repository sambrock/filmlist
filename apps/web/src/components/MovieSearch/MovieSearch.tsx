import { useReducer } from 'react';
import { useQuery } from '@tanstack/react-query';

import { trpc } from '../../lib/api/trpc';
import { MovieSearchInput } from './MovieSearchInput';
import { MovieSearchInputWrapper } from './MovieSearchInputWrapper';
import { MovieSearchResultsList } from './MovieSearchResultsList';
import { MovieSearchResultsListItem } from './MovieSearchResultsListItem';
import { MovieSearchWrapper } from './MovieSearchWrapper';

type State = {
  open: boolean;
  query: string;
};

type Action =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SET_QUERY'; payload: { query: string } };

export type Dispatch = React.ActionDispatch<[action: Action]>;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN': {
      return { ...state, open: true };
    }
    case 'CLOSE': {
      return { ...state, open: false };
    }
    case 'TOGGLE': {
      return { ...state, open: !state.open };
    }
    case 'SET_QUERY': {
      return { ...state, query: action.payload.query };
    }
    // case 'SELECT_RESULT': {
    //   return {...state}
    // }
    default: {
      return state;
    }
  }
}

export const MoviesSearch = () => {
  const [state, dispatch] = useReducer(reducer, { open: false, query: '' });

  const { data } = useQuery({
    queryKey: ['search', state.query],
    queryFn: () => trpc.movies.search.query({ query: state.query }),
    enabled: Boolean(state.query),
  });

  return (
    <MovieSearchWrapper>
      {(state.open && data.length > 0) && (
        <MovieSearchResultsList>
          {data.map((movie) => (
            <MovieSearchResultsListItem key={movie.tmdbId} movie={movie} />
          ))}
        </MovieSearchResultsList>
      )}

      <MovieSearchInputWrapper open={state.open} input={<MovieSearchInput dispatch={dispatch} />} />
    </MovieSearchWrapper>
  );
};
