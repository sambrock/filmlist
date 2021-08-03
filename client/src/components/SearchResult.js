import React from 'react';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import StarRating from './StarRating';
import LikeBtn from './buttons/LikeBtn';

export default function SearchResult({ movie, close }) {
  return (
    <div>
      <Link
        to={`/movie/${movie.id}-${slugify(movie.title, { lower: true, remove: /[*+~.()'"!:@]/g })}`}
        onClick={close}
      >
        <div className="flex flex-col mb-2 md:mb-3 border-grey hover:border-opacity-primary transition py-2 px-3 rounded-sm">
          <span className="font-bold text-lg md:text-xl mr-3">{movie.title}</span>
          <div className="mt-1">
            <span className="text-xs md:text-sm font-medium text-opacity-2 mr-3">{movie.year}</span>
            {movie.vote_average === '0.0' ? (
              ''
            ) : (
              <span className="font-semibold text-primary border-primary-opacity py-0.5 px-1.5 text-xxs md:text-xs">
                {movie.vote_average}
              </span>
            )}
          </div>
        </div>
      </Link>
      <StarRating filmId={movie.id} />
      <LikeBtn filmId={movie.id} like={false} />
    </div>
  );
}
