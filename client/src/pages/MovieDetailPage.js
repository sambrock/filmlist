import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { transitions } from '../config';
import BackdropTemplate from './templates/BackdropTemplate';
import { getIsAuthenticated } from '../store/auth';
import MovieButtons from '../components/MovieButtons';
import Head from '../components/Head';
import CreditItem from '../components/CreditItem';
import Footer from '../components/layout/Footer';
import useMovie from '../hooks/useMovie';

export default function MovieDetailPage({ match }) {
  const [movie, setMovie] = useState();

  const isAuthenticated = useSelector(getIsAuthenticated);

  const movieId = parseInt(match.params.id);
  const movieQuery = useMovie(movieId);

  console.log(movieQuery);

  useEffect(() => {
    if (!movieQuery.isLoading) setMovie(movieQuery.data.movie);
  }, [movieQuery]);

  if (movieQuery.isLoading || !movie) return <div></div>;

  return (
    <>
      <Head title={`${movie.title} (${movie.year})`} />
      <BackdropTemplate backdropPath={movie.backdrop_path}>
        <motion.div
          className="px-3 pt-6 md:px-12 md:pt-24 h-screen flex flex-col"
          variants={transitions.movieDetailsVariant}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0 }}
        >
          <motion.div variants={transitions.movieDetailsChildren}>
            <h1 className="text-heading font-extrabold mb-4 leading-none">{movie.title}</h1>
          </motion.div>
          <motion.div variants={transitions.movieDetailsChildren} className="flex mb-6 items-center">
            <span className="text-md font-medium text-opacity-2 mr-3">{movie.year}</span>
            <div className="text-md font-medium text-opacity-2 mr-3">
              {movie.runtime.hours !== 0 && <span className="mr-1">{movie.runtime.hours}h</span>}
              {movie.runtime.minutes !== 0 && <span>{movie.runtime.minutes}m</span>}
            </div>
            <span className="text-opacity-2 border-grey text-xs py-0.5 px-1.5 font-medium">
              {movie.certification ? movie.certification : 'Not Rated'}
            </span>
            {movie.vote_average ? (
              <div className="font-semibold text-primary border-primary-opacity text-xs py-0.5 px-1.5 ml-6">
                {movie.vote_average}
              </div>
            ) : (
              ''
            )}
          </motion.div>
          <motion.div variants={transitions.movieDetailsChildren} className="mb-6">
            {isAuthenticated ? (
              <MovieButtons
                movieId={movie.id}
                title={movie.title}
                ui={{ watchlist: movie.watchlist, rating: movie.rating, like: movie.like }}
              />
            ) : (
              <div className="text-sm sm:text-md text-opacity-2 default-border p-3 text-center">
                Rate, like or add this film to your watchlist.{' '}
                <Link to={`/login`} className="text-white font-medium">
                  Log in
                </Link>
                .
              </div>
            )}
          </motion.div>
          <motion.div variants={transitions.movieDetailsChildren} className="mb-12">
            <div className="leading-7 mb-6 text-sm md:text-md">{movie.overview}</div>
            <div className="font-semibold">
              {movie.genres.map((genre) => (
                <span className="mr-3">{genre.name}</span>
              ))}
            </div>
          </motion.div>
          <motion.div variants={transitions.movieDetailsChildren} className="mb-6">
            <h3 className="uppercase text-md text-orange1 font-semibold text-opacity-2 tracking-wider condensed">
              Crew
            </h3>
            <div className="flex flex-col overflow-x-hidden w-full list-none">
              {movie.credits.crew.map((member) => (
                <CreditItem name={member.name} role={member.job} />
              ))}
            </div>
          </motion.div>
          <motion.div variants={transitions.movieDetailsChildren}>
            <h3 className="uppercase text-md text-orange1 font-semibold text-opacity-2 tracking-wider condensed">
              Cast
            </h3>
            <div className="flex flex-col overflow-x-hidden w-full list-none">
              {movie.credits.cast.map((member) => (
                <CreditItem name={member.name} role={member.character} />
              ))}
            </div>
          </motion.div>
          <div className="py-12 mt-auto">
            <Footer />
          </div>
        </motion.div>
      </BackdropTemplate>
    </>
  );
}
