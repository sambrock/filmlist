import React, { useState } from 'react';
import styled from 'styled-components';

import useLike from '../../hooks/useLike';

const StyledSpan = styled.button`
  ${(props) => props.theme.mixins.buttonSize}
`;

export default function LikeBtn({ movieId, defaultLike, className }) {
  const [like, setLike] = useState(defaultLike || false);

  const likeQuery = useLike();

  const handleClick = (e, val) => {
    e.preventDefault();
    setLike(val);
    val ? likeQuery.mutate({ method: 'POST', movieId }) : likeQuery.mutate({ method: 'DELETE', movieId });
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
