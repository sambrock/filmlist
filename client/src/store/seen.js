import { createSlice } from '@reduxjs/toolkit';

import { apiRequest } from "./api";

const slice = createSlice({
  name: 'seen',
  initialState: {
    data: [],
    loading: false,
    pageNum: 1,
    hasMore: false
  },
  reducers: {
    initialRequested: (seen, action) => {
      seen.data = [];
      seen.pageNum = 2;
      seen.loading = true;
    },
    seenRequested: (seen, action) => {
      seen.loading = true;
      seen.pageNum = seen.pageNum + 1;
    },
    seenReceived: (seen, action) => {
      seen.data = [...seen.data, ...action.payload];
      seen.loading = false;
      seen.hasMore = action.payload.hasMore;

    },
    seenRequestFailed: (seen, action) => {
      seen.loading = false;
    },
    userSeenActioned: (seen, action) => {
      seen.data = seen.data.map(m => {
        if (m.id === action.payload.movieId) {
          return { ...m, userAction: action.payload.actionId };
        } else {
          return m;
        }
      });
    }
  }
});

export default slice.reducer;

const { initialRequested, seenReceived, seenRequested, seenRequestFailed } = slice.actions;
export const { userSeenActioned } = slice.actions;

export const loadSeen = (username, initial = false) => (dispatch, getState) => {
  const limit = 40;

  dispatch(apiRequest({
    url: initial ? `/api/${username}/seen?page=1&limit=${limit}` : `/api/${username}/seen?page=${getState().entities.seen.pageNum}&limit=${limit}`,
    onStart: initial ? initialRequested.type : seenRequested.type,
    onSuccess: seenReceived.type,
    onError: seenRequestFailed.type
  }))
};

export const getSeen = state => state.entities.seen.data;
export const loading = state => state.entities.seen.loading;
export const hasMore = state => state.entities.seen.hasMore;