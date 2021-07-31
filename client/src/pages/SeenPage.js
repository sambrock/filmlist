import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { loadSeen, getSeen, loading } from '../store/seen';
import { start, complete } from '../store/loadingBar';
import useIsUserAuth from '../hooks/useIsUserAuth';
import Head from '../components/Head';
import MovieList from '../components/MovieList';
import { PageContext } from '../App';
import useColumns from '../hooks/useColumns';

export default function SeenPage({ match }) {
  const { action } = useHistory();
  const [movies, setMovies] = useState([]);

  const dispatch = useDispatch();

  const loadedMovies = useSelector(getSeen);
  const seenLoading = useSelector(loading);

  const username = match.params.username;
  const isUserAuth = useIsUserAuth(username);

  useEffect(() => {
    if (action === 'POP' && movies.length !== 0) return;

    dispatch(start());
    dispatch(loadSeen(username, true));
  }, []);

  useEffect(() => {
    setMovies(loadedMovies);
    dispatch(complete());
  }, [loadedMovies, dispatch]);

  const handleLoadMore = () => {
    if (!seenLoading) dispatch(loadSeen(username));
  };

  const columns = useColumns(6);

  return (
    <>
      <Head title={`${username}'s Seen`} bodyAttributes={movies.length === 0 ? 'overflow-y-hidden' : ''} />
      <PageContext.Provider value={{ page: 'seen', columns, showButtons: isUserAuth }}>
        <MovieList
          movies={movies}
          length={movies.length}
          loadNext={() => dispatch(loadSeen(username))}
          loading={seenLoading}
        />
      </PageContext.Provider>
    </>
  );
}
