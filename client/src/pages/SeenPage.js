import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { PageContext } from '../App';
import useIsUserAuth from '../hooks/useIsUserAuth';
import useColumns from '../hooks/useColumns';
import useSeenMovies from '../hooks/useSeenMovies';
import Head from '../components/Head';
import MovieList from '../components/MovieList';

const DEFAULT_COLUMNS = 6;

export default function SeenPage({ match }) {
  const [movies, setMovies] = useState([]);

  const columns = useColumns(DEFAULT_COLUMNS);

  const username = match.params.username;
  const isUserAuth = useIsUserAuth(username);

  const seenQuery = useSeenMovies(username);

  useEffect(() => {
    if (!seenQuery.isFetching) setMovies([...seenQuery.data.pages.map((m) => m.data.results).flat()]);
  }, [seenQuery.isFetching, seenQuery.data]);

  return (
    <motion.div exit={{ opacity: 0 }}>
      <Head title={`${username}'s Seen`} bodyAttributes={movies.length === 0 ? 'overflow-y-hidden' : ''} />
      <PageContext.Provider value={{ page: 'seen', columns, showButtons: isUserAuth }}>
        <MovieList
          movies={movies}
          length={movies.length}
          loadNext={seenQuery.fetchNextPage}
          loading={seenQuery.isFetching}
          hasMore={true}
        />
      </PageContext.Provider>
    </motion.div>
  );
}
