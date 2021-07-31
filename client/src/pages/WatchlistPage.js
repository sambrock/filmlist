import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { motion } from 'framer-motion';

import { loadWatchlist, getWatchlist, loading } from '../store/watchlist';
import { start, complete } from '../store/loadingBar';
import useIsUserAuth from '../hooks/useIsUserAuth';
import MovieList from '../components/MovieList';
import Head from '../components/Head';
import useColumns from '../hooks/useColumns';
import { PageContext } from '../App';

export default function WatchlistPage({ match }) {
  const { action } = useHistory();
  const [watchlistEmpty, setWatchlistEmpty] = useState();
  const [mounted, setMounted] = useState(false);

  const loadedMovies = useSelector(getWatchlist);
  const watchlistLoading = useSelector(loading);
  const [movies, setMovies] = useState(action === 'POP' ? loadedMovies : []);

  const dispatch = useDispatch();

  const username = match.params.username;
  const isUserAuth = useIsUserAuth(username);

  useEffect(() => {
    if (action === 'POP' && movies.length !== 0) return;

    dispatch(start());
    dispatch(loadWatchlist(username, true));
    setMounted(true);
  }, [username, action]);

  useEffect(() => {
    console.log(loadedMovies);
    setMovies(loadedMovies);
    dispatch(complete());

    setWatchlistEmpty(false);
  }, [loadedMovies]);

  useEffect(() => {
    if (watchlistLoading || !mounted) return;
    if (loadedMovies.length === 0) return setWatchlistEmpty(true);
  }, [watchlistLoading]);

  const columns = useColumns(6);

  if (watchlistEmpty)
    return (
      <motion.div exit={{ opacity: 0 }} className="h-screen w-screen flex justify-center items-center">
        <div className="font-semibold text-xxl text-opacity-1">No films in this watchlist... yet.</div>
      </motion.div>
    );

  return (
    <>
      <Head title={`${username}'s Watchlist`} bodyAttributes={movies.length === 0 ? 'overflow-y-hidden' : ''} />
      <PageContext.Provider value={{ page: 'watchlist', columns }}>
        <MovieList
          movies={movies}
          length={movies.length}
          loadNext={() => dispatch(loadWatchlist(username))}
          loading={watchlistLoading}
          // hasMore={}
        />
      </PageContext.Provider>
    </>
  );
}
