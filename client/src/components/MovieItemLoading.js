import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';

const StyledAnimatedLoadingItemDiv = styled.div`
  @keyframes animation {
    0%   {opacity: .4;}
    50%  {opacity: .6;}
    100% {opacity: .4;}
  }

  opacity: .4;
  /* animation-name: animation;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: var(--easing); */
`;

export default function LoadingMovieItem({ showUserRating }) {
  const [height, setHeight] = useState();
  const divRef = useRef();

  useEffect(() => {
    if (divRef.current) setHeight((divRef.current.offsetWidth / 100) * 150);
  }, [divRef]);

  return (
    <div>
      <StyledAnimatedLoadingItemDiv className="w-full h-full bg-grey" style={{ height }} ref={divRef} />
      {(showUserRating && height) && (<StyledAnimatedLoadingItemDiv className="bg-grey h-5 w-1/2 mt-3" />)}
    </div>
  );
}
