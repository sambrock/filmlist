import React, { createContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'styled-components';

import { MoviesPage, MovieDetailPage, RegisterPage, WatchlistPage, SeenPage, SearchPage, FavoriteMovies, LoginPage, NotFoundPage } from './pages';
import LoadingBar from './components/layout/LoadingBar';
import NotificationList from './components/NotificationList';
import Layout from './components/Layout';
import { loadUser } from './store/auth';

import configureStore from './store/configureStore';

import GlobalStyle from './styles/GlobalStyles';
import theme from './styles/theme';

const store = configureStore();

export const PageContext = createContext();

export default function App() {
  useEffect(() => store.dispatch(loadUser()));

  return (
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <LoadingBar />
          <Layout>
            <Route
              render={({ location }) => (
                <AnimatePresence initial={false} exitBeforeEnter>
                  <Switch location={location} key={location.pathname}>
                    <Route path="/movie/:id" component={MovieDetailPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/search" component={SearchPage} />
                    <Route path="/favorite-films" component={FavoriteMovies} />
                    <Route path="/:username/watchlist" component={WatchlistPage} />
                    <Route path="/:username/seen" component={SeenPage} />
                    <Route exact path="/" component={MoviesPage} />
                    <Route component={NotFoundPage} />
                  </Switch>
                </AnimatePresence>
              )}
            />
          </Layout>
          <NotificationList />
        </ThemeProvider>
      </Provider>
    </Router>
  );
}
