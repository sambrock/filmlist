import React from 'react';
import { Link } from 'react-router-dom';
import slugify from 'slugify';

import MovieItem from './MovieItem';
import StarRating from './StarRating';

export default function Cell({ columnIndex, rowIndex, style, movies, page, columns }) {
  const index = rowIndex * columns + columnIndex;
  const movie = movies[index];

  if (index >= movies.length) return <div></div>;
  
  return (
    <Link to={`/movie/${movie.id}-${slugify(movie.title, { lower: true, remove: /[*+~.()'"!:@]/g })}`}>
      <div className="margin-movie-item-default grid" style={{ ...style, top: style.top + 90 }}>
        <MovieItem key={index} movie={movie} showButtons={true} page={page} />
        <div className="block sm:hidden mt-2 mb-4">
          <div className="font-bold text-md">{movie.title}</div>
          <div className="flex items-center mt-1">
            <div className="text-sm font-medium text-opacity-2 mr-3 py-0.5">{movie.year}</div>
            <div className="font-semibold text-primary border-primary-opacity text-xs py-0.5 px-1">{movie.vote_average}</div>
            {page === 'seen' && (
              <div className="flex sm:hidden items-center ml-auto py-0.5">
                <StarRating className="text-sm" rating={movie.rating} readOnly={true} /> {movie.like && <span className="material-icons ml-2 text-sm text-opacity-primary">favorite</span>}
              </div>
            )}
          </div>
        </div>
        {/* {<div className=" ml-3 hidden sm:block mt-2 mb-4"> <div className="font-bold text-md">{movie.title}</div> <div className="flex items-center mt-1"> <div className="text-sm font-medium text-opacity-2 mr-3 py-0.5">{movie.year}</div> <div className="font-semibold text-primary border-primary-opacity text-xs py-0.5 px-1" >{movie.vote_average}</div> {page === 'seen' && (<div className="flex sm:hidden items-center ml-auto py-0.5"> <StarRating className="text-sm" rating={movie.rating} readOnly={true} /> {movie.like && (<span className="material-icons ml-2 text-sm text-opacity-primary">favorite</span>)} </div>)} </div> </div>} */}
        {page === 'seen' && (
          <div className="hidden sm:flex justify-between items-center px-2 mb-2">
            <StarRating rating={movie.rating} readOnly={true} /> {movie.like && <span className="material-icons text-lg ml-3 text-opacity-primary">favorite</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
