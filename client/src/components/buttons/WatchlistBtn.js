import React, { useState } from 'react';
import styled from 'styled-components';

import useWatchlist from '../../hooks/useWatchlist';

const StyledSpan = styled.button`
  ${(props) => props.theme.mixins.buttonSize}
`;

export default function WatchlistBtn({ movieId, defaultWatchlist }) {
  const [inWatchlist, setInWatchlist] = useState(defaultWatchlist || false);

  const watchlistMutation = useWatchlist();

  const handleClick = (val) => {
    setInWatchlist(val);
    val ? watchlistMutation.mutate({ method: 'POST', movieId }) : watchlistMutation.mutate({ method: 'DELETE', movieId });
  };

  return !inWatchlist ? (
    <button aria-label="add to watchlist" onClick={() => handleClick(true)}>
      <StyledSpan className="material-icons text-primary font-bold">add</StyledSpan>
    </button>
  ) : (
    <button aria-label="remove from watchlist" onClick={() => handleClick(false)}>
      <StyledSpan className="material-icons text-primary font-bold">remove</StyledSpan>
    </button>
  );
}
