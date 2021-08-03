import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { addMovieWatchlist, deleteMovieWatchlist } from '../../store/movie';
import Add from '../../images/add-outline.svg';
import Added from '../../images/add-outline-orange.svg';

const StyledButtonContainerDiv = styled.div`
  img {
    width: 100%;
  }
`;

const StyledAddedContainerDiv = styled.div`
  @keyframes animation {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.8);
      opacity: 0;
    }
  }

  img {
    animation-name: animation;
    animation-duration: 1s;
    opacity: 0;
  }
`;

export default function WatchlistBtnMain({ id, title, watchlist, setWatchlist }) {
  const dispatch = useDispatch();

  const handleWatchlist = (e, inWatchlist) => {
    e.preventDefault();
    setWatchlist(inWatchlist);
    inWatchlist ? dispatch(addMovieWatchlist(id, title)) : dispatch(deleteMovieWatchlist(id, title));
  };

  return (
    <StyledButtonContainerDiv className="relative w-1/2 h-auto items-center flex">
      {!watchlist ? (
        <button className="z-50 w-full h-full" aria-label="add to watchlist" onClick={(e) => handleWatchlist(e, true)}>
          <img src={Add} alt="" />
        </button>
      ) : (
        <StyledAddedContainerDiv className="w-full h-full bottom-8">
          <img src={Added} alt="" />
        </StyledAddedContainerDiv>
      )}
    </StyledButtonContainerDiv>
  );
}
