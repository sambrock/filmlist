import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { getIsAuthenticated } from '../store/auth';
import MovieList from '../components/MovieList';
import Head from '../components/Head';
import { PageContext } from '../App';
import useColumns from '../hooks/useColumns';
import useMovies from '../hooks/useMovies';

const DEFAULT_COLUMNS = 5;

export default function Movies() {
  const [movies, setMovies] = useState([]);

  const columns = useColumns(DEFAULT_COLUMNS);

  const isAuthenticated = useSelector(getIsAuthenticated);

  const moviesQuery = useMovies();

  useEffect(() => {
    if (!moviesQuery.isFetching) setMovies(moviesQuery.data.movies);
  }, [moviesQuery.isFetching]);

  return (
    <motion.div exit={{ opacity: 0 }}>
      <Head />
      <PageContext.Provider value={{ page: 'movies', columns, showButtons: isAuthenticated }}>
        <MovieList
          movies={movies}
          length={movies.length}
          loadNext={moviesQuery.fetchNextPage}
          loading={moviesQuery.isFetching}
          hasMore={true}
        />
      </PageContext.Provider>
    </motion.div>
  );
}
