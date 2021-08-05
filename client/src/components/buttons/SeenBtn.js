import React from 'react';

import useSeen from '../../hooks/useSeen';

export default function SeenBtn({ movieId }) {
  const { mutate } = useSeen();

  return (
    <button
      className="font-bold text-opacity-2 z-50"
      aria-label="add to watchlist"
      onClick={(e) => {
        e.preventDefault();
        mutate({ method: 'POST', movieId });
      }}
    >
      <span className="material-icons">check</span>
    </button>
  );
}
