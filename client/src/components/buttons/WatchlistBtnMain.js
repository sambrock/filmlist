import React from 'react';

import Add from '../../images/add-outline.svg';
import useWatchlist from '../../hooks/useWatchlist';

export default function WatchlistBtnMain({ movieId }) {
  const { mutate } = useWatchlist();

  return (
    <div className="relative w-1/2 h-auto items-center flex">
      <button
        className="z-50 w-full h-full"
        aria-label="add to watchlist"
        onClick={(e) => {
          e.preventDefault();
          mutate({ method: 'POST', movieId });
        }}
      >
        <img className="w-full" src={Add} alt="Add to watchlist" />
      </button>
    </div>
  );
}
