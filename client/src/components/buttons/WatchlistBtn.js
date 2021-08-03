import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { addMovieWatchlist, deleteMovieWatchlist } from '../../store/movie';

const StyledSpan = styled.button`
  ${(props) => props.theme.mixins.buttonSize}
`;

export default function WatchlistBtn({ filmId, defaultWatchlist }) {
  const [inWatchlist, setInWatchlist] = useState(defaultWatchlist || false);

  const dispatch = useDispatch();

  const handleClick = (val) => {
    setInWatchlist(val);
    val ? dispatch(addMovieWatchlist(filmId)) : dispatch(deleteMovieWatchlist(filmId));
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
