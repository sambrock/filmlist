import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

import useColumns from '../hooks/useColumns';
import Grid from './Grid';
import MovieItemLoading from './MovieItemLoading';
import Cell from './Cell';

const StyledMovieListDiv = styled.div.attrs({ className: 'mx-auto' })`
  height: calc(100vh - 1px);
  direction: rtl;
`;

const StyledMovieListLoadingDiv = styled.div`
  padding-top: 90px;
  ${props => props.theme.mixins.width}
  ${props => props.theme.mixins.movieGrid(props.cols)}
`

export default function MovieList({ movies, loadNext, cols, showUserRating, showButtons, loading, hasMore, page }) {
  const columns = useColumns(cols);

  if (movies.length === 0) return (
    <StyledMovieListLoadingDiv className="grid mx-3 sm:mx-6 md:mx-auto" exit={{ opacity: 0 }} cols={cols}>
      {[...Array(10)].map((x, i) => <div className="px-2 mb-4"><MovieItemLoading key={i} showUserRating={showUserRating} /></div>)}
    </StyledMovieListLoadingDiv>
  )

  return (
    <motion.div exit={{ opacity: 0 }}>
      <StyledMovieListDiv>
        <Grid columns={columns} items={movies} rowCount={Math.ceil(movies.length / columns)} loading={loading} loadNext={loadNext} hasMore={hasMore} page={page} />
      </StyledMovieListDiv>
    </motion.div>
  )
}
