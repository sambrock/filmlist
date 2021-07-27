import React from 'react'
import Rating from '@material-ui/lab/Rating'
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { addMovieRating } from '../store/movie';

const StyledRatingsDiv = styled.div`
  .MuiRating-root {
    ${props => props.readOnly ? 'font-size: var(--fz-xl);' : props.theme.mixins.buttonSize}
    @media (max-width: ${props => props.theme.mixins.breakpoints.sm}) { 
      ${props => props.readOnly ? 'font-size: 1em;' : props.theme.mixins.buttonSize}
    }
  }
  
  .MuiRating-iconEmpty {
    .MuiSvgIcon-root {
      ${props => props.readOnly ? 'fill: none;' : 'fill: var(--primary);'}
      opacity: .1;
    }
  }

  .MuiRating-iconFilled {
    .MuiSvgIcon-root {
      ${props => props.readOnly ? 'fill: var(--opacity-primary);' : 'fill: var(--primary);'}
    }
  }

  .MuiRating-iconActive {
    transform: scale(1)
  }
`;

export default function StarRating({ filmId, readOnly, rating, setRating, removeWatchlist }) {
  const dispatch = useDispatch();

  const handleRating = (newRating) => {
    if (readOnly) return;
    if(setRating) setRating(newRating);
    dispatch(addMovieRating(filmId, newRating));
    if(removeWatchlist) removeWatchlist();
  }

  return (
    <StyledRatingsDiv readOnly={readOnly}>
      <Rating name="hover-feedback" defaultValue={rating} precision={0.5} readOnly={readOnly || false} onChange={(e, newValue) => handleRating(newValue)} />
    </StyledRatingsDiv>
  )
}
