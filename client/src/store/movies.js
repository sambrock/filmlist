import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { apiRequest } from './api';
import { errorsRecieved } from './error';

const slice = createSlice({
  name: 'movies',
  initialState: {
    data: [],
    loading: false,
    moreLoading: false,
    default: false,
    pageNum: 1,
    basedOn: [],
    hasMore: false
  },
  reducers: {
    defaultMoviesRequested: (movies, action) => {
      movies.loading = true;
      movies.default = true;
    },
    defaultMoviesReceived: (movies, action) => {
      movies.loading = false;
      movies.data = action.payload;
    },
    initialRequested: (movies, action) => {
      movies.data = [];
      movies.pageNum = 2;
      movies.loading = true;
    },
    moviesRequested: (movies, action) => {
      movies.loading = true;
      movies.pageNum = movies.pageNum + 1;
      if (movies.default) movies.data = [];
      movies.default = false;
    },
    moviesReceived: (movies, action) => {
      movies.loading = false;
      movies.data = _.uniqBy([...movies.data, ...action.payload.results], 'id');
      movies.basedOn = [...movies.basedOn, ...action.payload.basedOn];
      movies.hasMore = action.payload.hasMore;
    },
    moviesRequestFailed: (movies, action) => {
      movies.loading = false;
    },
    userMoviesActioned: (movies, action) => {
      movies.data = movies.data.map(m => {
        if (m.id === action.payload.movieId) {
          return { ...m, userAction: action.payload.actionId };
        } else {
          return m;
        }
      });
    },
    userMoviesActionedCleared: (movies, action) => {
      movies.data = movies.data.map(m => {
        if (m.id === action.payload.movieId) {
          delete m.userAction;
          return m;
        } else {
          return m;
        }
      });
    },
    moviesCleared: (movies, action) => {
      movies.data = [];
    }
  }
})

export default slice.reducer;

const { initialRequested, moviesRequested, moviesReceived, moviesRequestFailed, defaultMoviesRequested, defaultMoviesReceived, moviesCleared } = slice.actions;
export const { userMoviesActioned, userMoviesActionedCleared } = slice.actions;

// Action Creators
export const loadMovies = (initial = false) => (dispatch, getState) => {
  const limit = 40;

  dispatch(apiRequest({
    url: initial ? `/api/${getState().entities.auth.user.username}?page=1&limit=${limit}` :
      `/api/${getState().entities.auth.user.username}?page=${getState().entities.movies.pageNum}&limit=${limit}`,
    method: 'POST',
    data: { basedOn: getState().entities.movies.basedOn },
    onStart: initial ? initialRequested.type : moviesRequested.type,
    onSuccess: moviesReceived.type,
    onError: errorsRecieved.type,
    onFail: moviesRequestFailed.type,
    headers: { 'Content-Type': 'application/json' }
  }))
};

export const loadDefaultMovies = () => (dispatch, getState) => {
  const limit = 20;

  dispatch(apiRequest({
    url: `/api/movies/default?page=${getState().entities.movies.pageNum}&limit=${limit}`,
    onStart: defaultMoviesRequested.type,
    onSuccess: defaultMoviesReceived.type,
    onError: errorsRecieved.type,
    onFail: moviesRequestFailed.type
  }))
}

export const clearMovies = () => dispatch => {
  dispatch({ type: moviesCleared.type});
}

// Selectors
export const getMovies = state => state.entities.movies.data;
export const defaultLoaded = state => state.entities.movies.default;
export const loading = state => state.entities.movies.loading;
export const hasMore = state => state.entities.movies.hasMore;