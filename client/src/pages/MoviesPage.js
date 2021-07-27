import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion';
import { Redirect, useHistory } from 'react-router-dom';

import { transitions } from '../config';
import { loadMovies, getMovies, loadDefaultMovies, loading, defaultLoaded, clearMovies, hasMore } from '../store/movies';
import { getIsAuthenticated } from '../store/auth';
import { start, complete } from '../store/loadingBar';
import { getMoviesError } from '../store/error';
import MovieList from '../components/MovieList';
import Head from '../components/Head';

export default function Movies() {
  const { action } = useHistory();
  const [movies, setMovies] = useState([]);

  const dispatch = useDispatch();

  const defaultMoviesLoaded = useSelector(defaultLoaded)
  const loadedMovies = useSelector(getMovies);
  const moviesLoading = useSelector(loading);
  const isAuthenticated = useSelector(getIsAuthenticated);
  const moviesError = useSelector(getMoviesError);
  const moviesHasMore = useSelector(hasMore);

  useEffect(() => {
    if (isAuthenticated === null) return;
    if (action === 'POP' && movies.length !== 0) return;
    if (movies.length !== 0) return;

    dispatch(start());
    dispatch(clearMovies());

    isAuthenticated ? dispatch(loadMovies()) : dispatch(loadDefaultMovies())
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated === true && defaultMoviesLoaded) {
      setMovies([]);
      return dispatch(loadMovies());
    };

    setMovies(loadedMovies);
  }, [loadedMovies]);

  if (moviesError) { return <motion.div exit={{ opacity: 0 }} transition={transitions.default}><Redirect to={`/favorite-films`} /></motion.div> }
  dispatch(complete());

  return (
    <>
      <Head bodyAttributes={movies.length === 0 ? 'overflow-y-hidden' : ''} />
      <MovieList movies={movies} cols={5} length={movies.length} loadNext={() => isAuthenticated ? dispatch(loadMovies()) : dispatch(loadDefaultMovies())} loading={moviesLoading} showButtons={isAuthenticated} hasMore={moviesHasMore} page='movies' />
    </>
  )
}