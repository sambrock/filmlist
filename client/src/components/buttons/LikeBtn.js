import React from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { addMovieLike, deleteMovieLike } from '../../store/movie';

const StyledSpan = styled.button`
  ${props => props.theme.mixins.buttonSize}
`;

export default function LikeBtn({ filmId, like, setLike }) {
  const dispatch = useDispatch();

  const handleClick = (liked) => {
    if(setLike) setLike(liked);
    liked ? dispatch(addMovieLike(filmId)) : dispatch(deleteMovieLike(filmId));
  }

  return (
    !like ?
      <button aria-label="like" onClick={() => handleClick(true)}>
        <StyledSpan className="material-icons text-primary font-bold">favorite_border</StyledSpan>
      </button> :
      <button aria-label="unlike" onClick={() => handleClick(false)}>
        <StyledSpan className="material-icons text-primary font-bold">favorite</StyledSpan>
      </button>
  )
}
