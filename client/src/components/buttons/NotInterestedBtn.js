import React from 'react';

import useNotInterested from '../../hooks/useNotInterested';

export default function NotInterestedBtn({ movieId }) {
  const { mutate } = useNotInterested();

  return (
    <button
      className="font-bold text-opacity-2"
      aria-label="add to watchlist"
      onClick={(e) => {
        e.preventDefault();
        mutate({ method: 'POST', movieId });
      }}
    >
      <span className="material-icons">not_interested</span>
    </button>
  );
}
