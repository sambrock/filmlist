import React, { useState } from 'react';

import StarRating from './StarRating';
import LikeBtn from './buttons/LikeBtn';
import WatchlistBtn from './buttons/WatchlistBtn';

export default function MovieButtons({ filmId, title, ui }) {
  return (
    <div className="flex items-center justify-start">
      <div className="mr-6">
        <StarRating filmId={filmId} readOnly={false} defaultValue={ui.rating} />
      </div>
      <div className="mr-6">
        <WatchlistBtn filmId={filmId} title={title} defaultWatchlist={ui.watchlist} />
      </div>
      <div>
        <LikeBtn filmId={filmId} title={title} defaultLike={ui.like} />
      </div>
    </div>
  );
}
