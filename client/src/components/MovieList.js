import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { isMobile, isTablet } from 'react-device-detect';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import memoize from 'memoize-one';

import { PageContext } from '../App';
import Cell from './Cell';

const StyledMovieListDiv = styled.div.attrs({ className: 'mx-auto' })`
  height: calc(100vh - 1px);
  direction: rtl;
`;

const createItemData = memoize((items) => items);

function MovieList({ movies, loadNext, loading, hasMore }) {
  const itemData = createItemData(movies);

  const loadMoreItems = () => {
    if (loading) return;
    loadNext();
  };

  const isItemLoaded = (index) => !hasMore || index < movies.length;
  const itemCount = hasMore ? movies.length + 1 : movies.length;

  const itemsRendered =
    (columns, infiniteOnItemsRendered) =>
    ({ visibleColumnStartIndex, visibleColumnStopIndex, visibleRowStartIndex, visibleRowStopIndex }) => {
      const visibleStartIndex = visibleRowStartIndex * columns + visibleColumnStartIndex;
      const visibleStopIndex = visibleRowStopIndex * columns + visibleColumnStopIndex;

      infiniteOnItemsRendered({ visibleStartIndex, visibleStopIndex });
    };

  const calcGridSize = ({ page, height, width, columns }) => {
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

    if (isTablet || isMobile || width < 768) rowHeight = colWidth * 1.5 + 62;

    return { height, width, colWidth, rowHeight };
  };

  return (
    <motion.div exit={{ opacity: 0 }}>
      <StyledMovieListDiv>
        <AutoSizer className="mx-auto" style={{ height: '100%', width: '100%' }}>
          {({ height, width }) => (
            <PageContext.Consumer>
              {({ page, columns }) => (
                <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
                  {({ onItemsRendered, ref }) => (
                    <FixedSizeGrid
                      itemData={itemData}
                      className="pointer-events-auto"
                      columnCount={columns}
                      columnWidth={calcGridSize({ page, width, columns }).colWidth}
                      height={height}
                      rowCount={Math.ceil(movies.length / columns)}
                      rowHeight={calcGridSize({ page, width, columns }).rowHeight}
                      width={width}
                      onItemsRendered={itemsRendered(columns, onItemsRendered)}
                      ref={ref}
                    >
                      {Cell}
                    </FixedSizeGrid>
                  )}
                </InfiniteLoader>
              )}
            </PageContext.Consumer>
          )}
        </AutoSizer>
      </StyledMovieListDiv>
    </motion.div>
  );
}

export default MovieList;
