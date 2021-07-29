import React, { memo, pure } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { isMobile, isTablet } from 'react-device-detect';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeGrid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import slugify from 'slugify';
import { Link } from 'react-router-dom';
import memoize from 'memoize-one';

import useColumns from '../hooks/useColumns';
import MovieItemLoading from './MovieItemLoading';
import MovieItem from './MovieItem';
import StarRating from './StarRating';

const StyledMovieListDiv = styled.div.attrs({ className: 'mx-auto' })`
  height: calc(100vh - 1px);
  direction: rtl;
`;

const StyledMovieListLoadingDiv = styled.div`
  padding-top: 90px;
  ${(props) => props.theme.mixins.width}
  ${(props) => props.theme.mixins.movieGrid(props.cols)}
`;

const StyledCellLoading = styled.div`
  background: var(--red);
  height: 50px;
  width: 100%;
`;

const Cell = memo(({ columnIndex, data, isScrolling, rowIndex, style }) => {
  const index = rowIndex * 6 + columnIndex;
  const movie = data[index];

  const page = 'movies'

  if (index >= data.length) return <div></div>;

  return (
    <Link to={`/movie/${movie.id}-${slugify(movie.title, { lower: true, remove: /[*+~.()'"!:@]/g })}`}>
      <div className="margin-movie-item-default grid" style={{ ...style, top: style.top + 90 }}>
        <MovieItem key={index} movie={movie} showButtons={true} page={page} />
        <div className="block sm:hidden mt-2 mb-4">
          <div className="font-bold text-md">{movie.title}</div>
          <div className="flex items-center mt-1">
            <div className="text-sm font-medium text-opacity-2 mr-3 py-0.5">{movie.year}</div>
            <div className="font-semibold text-primary border-primary-opacity text-xs py-0.5 px-1">{movie.vote_average}</div>
            {page === 'seen' && (
              <div className="flex sm:hidden items-center ml-auto py-0.5">
                <StarRating className="text-sm" rating={movie.rating} readOnly={true} /> {movie.like && <span className="material-icons ml-2 text-sm text-opacity-primary">favorite</span>}
              </div>
            )}
          </div>
        </div>
        {/* {<div className=" ml-3 hidden sm:block mt-2 mb-4"> <div className="font-bold text-md">{movie.title}</div> <div className="flex items-center mt-1"> <div className="text-sm font-medium text-opacity-2 mr-3 py-0.5">{movie.year}</div> <div className="font-semibold text-primary border-primary-opacity text-xs py-0.5 px-1" >{movie.vote_average}</div> {page === 'seen' && (<div className="flex sm:hidden items-center ml-auto py-0.5"> <StarRating className="text-sm" rating={movie.rating} readOnly={true} /> {movie.like && (<span className="material-icons ml-2 text-sm text-opacity-primary">favorite</span>)} </div>)} </div> </div>} */}
        {page === 'seen' && (
          <div className="hidden sm:flex justify-between items-center px-2 mb-2">
            <StarRating rating={movie.rating} readOnly={true} /> {movie.like && <span className="material-icons text-lg ml-3 text-opacity-primary">favorite</span>}
          </div>
        )}
      </div>
    </Link>
  );
}, areEqual);

const createItemData = memoize((items) => items);

function MovieList({ movies, loadNext, cols, showUserRating, showButtons, loading, hasMore, page }) {
  const columns = useColumns(cols);

  const itemData = createItemData(movies);

  const loadMoreItems = () => {
    if (loading) return;
    loadNext();
  };

  const isItemLoaded = (index) => !hasMore || index < movies.length;
  const itemCount = hasMore ? movies.length + 1 : movies.length;

  const itemsRendered =
    (infiniteOnItemsRendered) =>
    ({ visibleColumnStartIndex, visibleColumnStopIndex, visibleRowStartIndex, visibleRowStopIndex }) => {
      const visibleStartIndex = visibleRowStartIndex * columns + visibleColumnStartIndex;
      const visibleStopIndex = visibleRowStopIndex * columns + visibleColumnStopIndex;

      infiniteOnItemsRendered({ visibleStartIndex, visibleStopIndex });
    };

  const calcGridSize = ({ height, width }) => {
    let colWidth;
    if (columns > 3) {
      colWidth = width / columns - (width * 0.06) / columns - (width * 0.06) / columns - 3;
    } else {
      colWidth = width / columns - 7;
    }

    let rowHeight = colWidth * 1.5;
    if (page === 'movies') rowHeight = rowHeight - 8;
    if (page === 'watchlist') rowHeight = rowHeight - 8;
    if (page === 'seen') rowHeight = rowHeight + 35 - 8;

    if (isTablet || isMobile) rowHeight = colWidth * 1.5 + 62;

    return { height, width, colWidth, rowHeight };
  };

  const rowCount = Math.ceil(movies.length / columns);

  if (movies.length === 0)
    return (
      <StyledMovieListLoadingDiv className="grid mx-3 sm:mx-6 md:mx-auto" exit={{ opacity: 0 }} cols={cols}>
        {[...Array(10)].map((x, i) => (
          <div className="px-2 mb-4">
            <MovieItemLoading key={i} showUserRating={showUserRating} />
          </div>
        ))}
      </StyledMovieListLoadingDiv>
    );

  return (
    <motion.div exit={{ opacity: 0 }}>
      <StyledMovieListDiv>
        <AutoSizer className="mx-auto" style={{ height: '100%', width: '100%' }}>
          {({ height, width }) => (
            <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
              {({ onItemsRendered, ref }) => (
                <FixedSizeGrid itemData={itemData} className="pointer-events-auto" columnCount={columns} columnWidth={calcGridSize({ width }).colWidth} height={height} rowCount={rowCount} rowHeight={calcGridSize({ width }).rowHeight} width={width} onItemsRendered={itemsRendered(onItemsRendered)} ref={ref}>
                  {Cell}
                </FixedSizeGrid>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </StyledMovieListDiv>
    </motion.div>
  );
}

export default memo(MovieList);

// {({ columnIndex, rowIndex, style }) => <Cell columns={columns} columnIndex={columnIndex} rowIndex={rowIndex} style={style} movies={movies} page={page} />}
