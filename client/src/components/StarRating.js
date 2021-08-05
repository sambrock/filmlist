import React from 'react';
import Rating from '@material-ui/lab/Rating';
import styled from 'styled-components';

import useRating from '../hooks/useRating';

const StyledRatingsDiv = styled.div`
  color: ${(props) => props.color};

  .MuiRating-root {
    ${(props) => (props.readOnly ? 'font-size: var(--fz-xl);' : props.theme.mixins.buttonSize)}
    @media (max-width: ${(props) => props.theme.mixins.breakpoints.sm}) {
      ${(props) => (props.readOnly ? 'font-size: 1em;' : props.theme.mixins.buttonSize)}
    }
  }

  .MuiRating-iconEmpty {
    .MuiSvgIcon-root {
      ${(props) => (props.readOnly ? 'fill: none;' : 'fill: var(--primary);')}
      opacity: .1;
    }
  }

  .MuiRating-iconFilled {
    .MuiSvgIcon-root {
      ${(props) => (props.readOnly ? 'fill: var(--opacity-primary);' : 'fill: var(--primary);')}
    }
  }

  .MuiRating-iconActive {
    transform: scale(1);
  }
`;

export default function StarRating({ movieId, defaultValue, readOnly, color }) {
  const { mutate } = useRating();

  return (
    <StyledRatingsDiv readOnly={readOnly} onClick={(e) => e.stopPropagation()} color={color}>
      <Rating
        defaultValue={defaultValue}
        precision={0.5}
        readOnly={readOnly || false}
        onChange={(e, newValue) => mutate({ movieId, rating: newValue })}
      />
    </StyledRatingsDiv>
  );
}
