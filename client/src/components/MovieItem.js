import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

import { userActions, springConfig, tmdbImageUrl, springConfigFast } from '../config';
import MovieItemButtons from './MovieItemButtons';
import StarRating from './StarRating';
import LikeBtn from './buttons/LikeBtn';

export default function MovieItem({ movie }) {
  const [action, setAction] = useState(false);
  const [show, setShow] = useState();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgAnimated, setImgAnimated] = useState(false);

  const [posterAnimateStyles, posterAnimate] = useSpring(() => ({ opacity: 1, config: springConfig }));
  const [backdropAnimateStyles, backdropAnimate] = useSpring(() => ({ opacity: 0, config: springConfig }));
  const [posterImgAnimateStyles, posterImgAnimate] = useSpring(() => ({ config: springConfig }));
  const [backdropImgAnimateStyles, backdropImgAnimate] = useSpring(() => ({ config: springConfig }));
  const [infoAnimateStyles, infoAnimate] = useSpring(() => ({ config: springConfig }));

  const animations = [
    { spring: posterAnimate, in: { opacity: 0 }, out: { opacity: 1 } },
    {
      spring: posterImgAnimate,
      in: { transform: `scale(1.1)`, filter: `blur(2px)` },
      out: { transform: `scale(1.001)`, filter: `blur(0px)` },
    },
    { spring: backdropAnimate, in: { opacity: 1 }, out: { opacity: 0 } },
    {
      spring: backdropImgAnimate,
      in: { transform: `scale(1.02)`, filter: `blur(2px) brightness(50%)` },
      out: { transform: `scale(1.1)`, filter: `blur(4px) brightness(50%)` },
    },
    { spring: infoAnimate, in: { opacity: 1 }, out: { opacity: 0 } },
  ];

  const [imgAnimationStyles, imgAnimate] = useSpring(() => ({ opacity: 0, config: springConfigFast }));

  useEffect(() => {
    if (action) return;
    animations.map((a) => a.spring.start(show ? a.in : a.out));
  }, [show, action]);

  useEffect(() => {
    if (imgLoaded && !imgAnimated) {
      imgAnimate.start({ opacity: 1 });
      setImgAnimated(true);
    }
  }, [imgLoaded]);

  useEffect(() => {
    if (!movie.userAction) return;
    setAction(userActions[movie.userAction - 1]);
    animations.map((a) => a.spring.start(a.out));
  }, [movie]);

  return (
    <div className={`block px-2 py-2 overflow-hidden relative h-full`}>
      <div
        className="h-full pointer-events-none sm:pointer-events-auto relative cursor-pointer flex"
        onMouseOver={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <animated.div
          style={posterAnimateStyles}
          className=" max-w-full my-0 mx-auto h-full w-full top-0 left-0 overflow-hidden"
        >
          <div className="relative">
            <div className="absolute top-0 left-0 bg-opacity-3 w-full ratio" />
            <animated.img
              style={{ ...imgAnimationStyles, ...posterImgAnimateStyles }}
              className={`w-full object-cover z-10 ${action ? 'hidden' : 'block'}`}
              src={tmdbImageUrl.poster + movie.poster_path}
              alt="movie poster"
            />
          </div>
          <animated.div
            className={`flex flex-col justify-center items-center w-full h-full object-cover border-default ratio 
            ${!action ? 'hidden' : 'block'}`}
          >
            {action.id === 2 && (
              <div className="z-40 flex absolute top-6 left-6 justify-between">
                <StarRating filmId={movie.id} color="text-opacity-1" />
                <LikeBtn filmId={movie.id} className="text-semibold text-opacity-1" />
              </div>
            )}
            <span className="material-icons font-bold text-heading mb-2 text-opacity-1">{action.icon}</span>
            <div className="uppercase font-medium text-opacity-1 flex items-center">{action.text}</div>
            <animated.div className="absolute bottom-6 left-6 right-6">
              <div className="font-bold text-xl text-opacity-2">{movie.title}</div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-sm font-medium text-opacity-1 py-1">{movie.year}</div>
                <div className="font-semibold text-opacity-1 text-sm py-0.5 border-opacity px-2">
                  {movie.vote_average}
                </div>
              </div>
            </animated.div>
          </animated.div>
        </animated.div>
        <animated.div
          style={backdropAnimateStyles}
          className="hidden sm:block max-w-full my-0 mx-auto h-full absolute top-0 left-0"
        >
          <div className="w-full h-full overflow-hidden relative">
            <animated.img
              style={backdropImgAnimateStyles}
              className="blur w-full h-full object-cover brightness-50"
              src={
                movie.backdrop_path
                  ? tmdbImageUrl.backdrop + movie.backdrop_path
                  : tmdbImageUrl.backdrop + movie.poster_path
              }
              alt={movie.title}
              onLoad={() => setImgLoaded(true)}
            />
          </div>
          <MovieItemButtons show={show} movieId={movie.id} disable={action ? true : false} />
          <animated.div style={infoAnimateStyles} className="absolute bottom-6 left-6 right-6">
            <div className="font-bold text-xl">{movie.title}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-sm font-medium text-opacity-2 py-1">{movie.year}</div>
              <div className="font-semibold text-primary border-primary-opacity text-sm py-0.5 px-2">
                {movie.vote_average}
              </div>
            </div>
          </animated.div>
        </animated.div>
      </div>
    </div>
  );
}
