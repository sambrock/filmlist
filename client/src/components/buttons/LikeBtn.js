import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { addMovieLike, deleteMovieLike } from '../../store/movie';

const StyledSpan = styled.button`
  ${(props) => props.theme.mixins.buttonSize}
`;

export default function LikeBtn({ filmId, defaultLike, className }) {
  const [like, setLike] = useState(defaultLike || false);

  const dispatch = useDispatch();

  const handleClick = (e, val) => {
    e.preventDefault();
    setLike(val);
    val ? dispatch(addMovieLike(filmId)) : dispatch(deleteMovieLike(filmId));
  };

  return !like ? (
    <button aria-label="like" onClick={(e) => handleClick(e, true)}>
      <StyledSpan className={`material-icons ${className ? className : 'text-primary font-bold'}`}>
        favorite_border
      </StyledSpan>
    </button>
  ) : (
    <button aria-label="unlike" onClick={(e) => handleClick(e, false)}>
      <StyledSpan className={`material-icons ${className ? className : 'text-primary font-bold'}`}>favorite</StyledSpan>
    </button>
  );
}
