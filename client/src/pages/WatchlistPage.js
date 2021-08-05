import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { PageContext } from '../App';
import useIsUserAuth from '../hooks/useIsUserAuth';
import useColumns from '../hooks/useColumns';
import useWatchlistMovies from '../hooks/useWatchlistMovies';
import Head from '../components/Head';
import MovieList from '../components/MovieList';

const DEFAULT_COLUMNS = 6;

export default function WatchlistPage({ match }) {
  const [movies, setMovies] = useState([]);

  const columns = useColumns(DEFAULT_COLUMNS);

  const username = match.params.username;
  const isUserAuth = useIsUserAuth(username);

  const watchlistQuery = useWatchlistMovies(username);

  useEffect(() => {
    if (!watchlistQuery.isFetching) setMovies([...watchlistQuery.data.pages.map((m) => m.data.results).flat()]);
  }, [watchlistQuery.isFetching, watchlistQuery.data]);

  return (
    <motion.div exit={{ opacity: 0 }}>
      <Head title={`${username}'s Watchlist`} bodyAttributes={movies.length === 0 ? 'overflow-y-hidden' : ''} />
      <PageContext.Provider value={{ page: 'watchlist', columns, showButtons: isUserAuth }}>
        <MovieList
          movies={movies}
          length={movies.length}
          loadNext={watchlistQuery.fetchNextPage}
          loading={watchlistQuery.isFetching}
          hasMore={true}
        />
      </PageContext.Provider>
    </motion.div>
  );
}
