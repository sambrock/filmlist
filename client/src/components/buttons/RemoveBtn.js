import React from 'react';

import { PageContext } from '../../App';
import useWatchlist from '../../hooks/useWatchlist';
import useSeen from '../../hooks/useSeen';

const Button = ({ remove }) => (
  <button className="font-bold text-opacity-2" aria-label="remove" onClick={(e) => {e.preventDefault(); remove()}}>
    <span className="material-icons">clear</span>
  </button>
);

const RemoveWatchlist = ({ movieId }) => {
  const { mutate } = useWatchlist();

  return <Button remove={() => mutate({ method: 'DELETE', movieId })} />;
};

const RemoveSeen = ({ movieId }) => {
  const { mutate } = useSeen();

  return <Button remove={() => mutate({ method: 'DELETE', movieId })} />;
};

export default function RemoveBtn({ movieId }) {
  return (
    <PageContext.Consumer>
      {({ page }) => {
        if (page === 'watchlist') return <RemoveWatchlist movieId={movieId} />;
        if (page === 'seen') return <RemoveSeen movieId={movieId} />;
      }}
    </PageContext.Consumer>
  );
}
