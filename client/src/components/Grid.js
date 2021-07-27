import React, { memo } from 'react'
import { areEqual, FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { isMobile, isTablet } from 'react-device-detect';
import slugify from 'slugify';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import MovieItem from './MovieItem';

const Cell = memo(({ columnIndex, rowIndex, style, movies, page, columns }) => {
  const index = rowIndex * columns + columnIndex;
  const movie = movies[index];

  if (index >= movies.length) return <div></div>;
  
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

export default function Grid({ columns, rowCount, loading, loadNext, hasMore, items, children, page, movies }) {
  const loadMoreItems = () => {
    if (loading) return;
    loadNext();
  };

  const isItemLoaded = index => !hasMore || index < items.length;
  const itemCount = hasMore ? items.length + 1 : items.length;

  const itemsRendered = infiniteOnItemsRendered => ({ visibleColumnStartIndex, visibleColumnStopIndex, visibleRowStartIndex, visibleRowStopIndex, }) => {
    const visibleStartIndex = visibleRowStartIndex * columns + visibleColumnStartIndex;
    const visibleStopIndex = visibleRowStopIndex * columns + visibleColumnStopIndex;

    infiniteOnItemsRendered({ visibleStartIndex, visibleStopIndex });
  };

  const calcGridSize = ({ height, width }) => {
    let colWidth;
    if (columns > 3) {
      colWidth = (width / columns) - ((width * .06) / columns) - ((width * .06) / columns) - 3;
    } else {
      colWidth = (width / columns) - 7;
    }

    let rowHeight = colWidth * 1.5;
    if (page === 'movies') rowHeight = rowHeight - 8;
    if (page === 'watchlist') rowHeight = rowHeight - 8;
    if (page === 'seen') rowHeight = rowHeight + 35 - 8;

    if (isTablet || isMobile) rowHeight = colWidth * 1.5 + 62;

    return { height, width, colWidth, rowHeight };
  }

  return (
    <AutoSizer className="mx-auto" style={{ height: '100%', width: '100%' }}>
      {({ height, width }) => (
        <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
          {({ onItemsRendered, ref }) => (
            <FixedSizeGrid className="pointer-events-auto" columnCount={columns} columnWidth={calcGridSize({ width }).colWidth} height={height} rowCount={rowCount} rowHeight={calcGridSize({ width }).rowHeight} width={width} onItemsRendered={itemsRendered(onItemsRendered)} ref={ref}>
              {({ columnIndex, rowIndex, style }) => <Cell columns={columns} columnIndex={columnIndex} rowIndex={rowIndex} style={style} movies={items} page={page} />}
            </FixedSizeGrid>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  )
}
