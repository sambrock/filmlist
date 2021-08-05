import React, { useState } from 'react';

import StarRating from './StarRating';
import LikeBtn from './buttons/LikeBtn';
import WatchlistBtn from './buttons/WatchlistBtn';

export default function MovieButtons({ movieId, title, ui }) {
  return (
    <div className="flex items-center justify-start">
      <div className="mr-6">
        <StarRating movieId={movieId} readOnly={false} defaultValue={ui.rating} />
      </div>
      <div className="mr-6">
        <WatchlistBtn movieId={movieId} title={title} defaultWatchlist={ui.watchlist} />
      </div>
      <div>
        <LikeBtn movieId={movieId} title={title} defaultLike={ui.like} />
      </div>
    </div>
  );
}
