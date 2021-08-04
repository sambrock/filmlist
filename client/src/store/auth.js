import { createSlice } from '@reduxjs/toolkit';
import { apiRequest } from './api';
import { errorsRecieved } from './error';

const slice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('token'),
    authenticated: null,
    loading: false,
    user: null,
  },
  reducers: {
    userRequested: (user, action) => {
      user.loading = true;
    },
    userReceived: (user, action) => {
      user.authenticated = true;
      user.loading = false;
      user.user = action.payload;
    },
    userRequestReceived: (user, action) => {
      user.authenticated = true;
      user.loading = false;
      user.token = action.payload.token;
      user.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
    },
    userRequestFailed: (user, action) => {
      user.token = null;
      user.user = null;
      user.authenticated = false;
      user.loading = false;
      localStorage.removeItem('token');
    },
    userLogoutSuccess: (user, action) => {
      user.token = null;
      user.user = null;
      user.authenticated = false;
      user.loading = false;
      localStorage.removeItem('token');
    },
  },
});

export default slice.reducer;

const { userRequested, userReceived, userRequestReceived, userRequestFailed, userLogoutSuccess } = slice.actions;

export const registerUser = (username, email, password) => (dispatch) => {
  const config = { headers: { 'content-type': 'application/json' } };

  dispatch(
    apiRequest({
      url: '/api/auth/register',
      method: 'post',
      onStart: userRequested.type,
      onSuccess: userRequestReceived.type,
      onFail: userRequestFailed.type,
      onError: errorsRecieved.type,
      data: { username, email, password },
      config: config,
    })
  );
};

export const loadUser = () => (dispatch, getState) => {
  dispatch(
    apiRequest({
      url: '/api/auth/user',
      onStart: userRequested.type,
      onSuccess: userReceived.type,
      onError: userRequestFailed.type,
      headers: tokenConfig(getState).headers,
    })
  );
};

export const loginUser = (email, password) => (dispatch, getState) => {
  dispatch(
    apiRequest({
      url: '/api/auth/login',
      method: 'post',
      onStart: userRequested.type,
      onSuccess: userRequestReceived.type,
      onFail: userRequestFailed.type,
      onError: errorsRecieved.type,
      data: { email, password },
      headers: tokenConfig(getState).headers,
    })
  );
};

export const logoutUser = () => (dispatch) => {
  dispatch({ type: userLogoutSuccess.type });
};

// Selectors
export const getIsAuthenticated = (state) => state.entities.auth.authenticated;
export const getUser = (state) => state.entities.auth.user;
export const getIsLoading = (state) => state.entities.auth.loading;
export const loading = (state) => state.entities.auth.loading;
export const getToken = (state) => state.entities.auth.token;

// Get token and config
export const tokenConfig = (getState) => {
  const token = getState().entities.auth.token;

  const config = {
    headers: { 'content-type': 'application/json' },
  };

  if (token) config.headers['x-auth-token'] = token;
  return config;
};
