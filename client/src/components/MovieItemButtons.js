import React, { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

import WatchlistBtnMain from './buttons/WatchlistBtnMain';
import NotInterestedBtn from './buttons/NotInterestedBtn';
import SeenBtn from './buttons/SeenBtn';
import RemoveBtn from './buttons/RemoveBtn';
import { springConfig } from '../config';
import { PageContext } from '../App';

const MovieBtns = ({ show, movieId }) => {
  const [topButtonAnimateStyles, topButtonAnimate] = useSpring(() => ({
    opacity: 0,
    transform: `blur(2px)`,
    config: springConfig,
  }));

  const [addButtonAnimateStyles, addButtonAnimate] = useSpring(() => ({
    opacity: 0,
    filter: `blur(2px)`,
    config: springConfig,
  }));

  useEffect(() => {
    topButtonAnimate.start({ opacity: show ? 1 : 0, transform: show ? `blur(0px)` : `blur(5px)` });
    addButtonAnimate.start({ opacity: show ? 1 : 0, filter: show ? `blur(0px)` : `blur(5px)` });
  }, [show, topButtonAnimate, addButtonAnimate]);

  return (
    <div className={`${show ? '' : 'hidden'}`}>
      <animated.div style={topButtonAnimateStyles} className="z-50 absolute top-6 left-6">
        <SeenBtn movieId={movieId} />
      </animated.div>
      <animated.div style={topButtonAnimateStyles} className="z-50 absolute top-6 right-6">
        <NotInterestedBtn movieId={movieId} />
      </animated.div>
      <animated.div
        style={addButtonAnimateStyles}
        className="z-40 absolute w-full h-full top-0 left-0 flex justify-center items-center"
      >
        <WatchlistBtnMain movieId={movieId} />
      </animated.div>
    </div>
  );
};

const WatchlistBtns = ({ movieId, show }) => (
  <div className={`${show ? '' : 'hidden'}`}>
    <div className="z-50 absolute top-6 right-6">
      <RemoveBtn movieId={movieId} />
    </div>
  </div>
);

const SeenBtns = ({ movieId, show }) => (
  <div className={`${show ? '' : 'hidden'}`}>
    <div className="z-50 absolute top-6 right-6">
      <RemoveBtn movieId={movieId} />
    </div>
  </div>
);

const MovieItemButtons = ({ movieId, show, disable }) => (
  <PageContext.Consumer>
    {({ page }) => {
      if (page === 'movies') return <MovieBtns movieId={movieId} show={show} />;
      if (page === 'seen') return <WatchlistBtns movieId={movieId} show={show} />;
      if (page === 'watchlist') return <SeenBtns movieId={movieId} show={show} />;
    }}
  </PageContext.Consumer>
);

export default MovieItemButtons;
