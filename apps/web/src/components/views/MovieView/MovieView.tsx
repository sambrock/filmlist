import { Suspense } from 'react';

import type { Movie } from '@filmlist/api';
import { runtimeMinutesToHours } from '@/lib/utils/runtime';
import { MovieActivityStoreProvider } from '@/providers/MovieActivityStoreProvider';
import { MovieProvider } from '@/providers/MovieProvider';
import { MovieActionsLikeButton } from '@/components/movie-actions/MovieActionsLikeButton';
import { MovieActionsWatchButton } from '@/components/movie-actions/MovieActionsWatchButton';
import { DividerDot } from '../../common/Divider';
import { MovieActivityStoreSubscriber } from '../../movie-actions/MovieActivityStoreSubscriber';
import { MovieActionsRatingInput } from '../../movie-actions/MoviesActionsRatingInput';
import { MovieBackdropImage } from '../../movie/MovieBackdrop';
import { MovieGenre } from '../../movie/MovieGenre';
import { MoviePoster } from '../../movie/MoviePoster';
import { MovieViewCast } from './MovieViewCast';
import { MovieViewStreaming } from './MovieViewStreaming';

type MovieViewProps = {
  movie: Movie;
  initialActivity: UserMovieActivity;
};

export const MovieView = ({ movie, initialActivity }: MovieViewProps) => {
  return (
    <MovieProvider movie={movie}>
      <div className="relative">
        <div className="-mx-8 flex h-[calc(100vh-160px)] justify-center overflow-clip">
          <MovieBackdropImage
            className="animate-backdrop-scroll w-full object-cover"
            backdropPath={movie.backdropPath}
          />
        </div>
        <div className="absolute -right-8 -bottom-[2px] -left-8 h-full bg-linear-to-t from-bg-subtle to-transparent" />

        <div className="px-margin max-w-container absolute bottom-0 left-1/2 mb-6 grid w-full -translate-x-1/2 grid-cols-[minmax(240px,240px)_5fr] gap-8">
          <MoviePoster
            className="self-end rounded-lg object-cover drop-shadow-xl"
            posterPath={movie.posterPath}
          />

          <div className="mt-24 flex w-full flex-col gap-2 self-end">
            <div className="wrap flex items-baseline">
              <h1 className="text-5xl leading-10 font-black antialiased drop-shadow-md">{movie.title}</h1>

              <div className="ml-4 text-base font-medium text-neutral-100/70">
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
                <span className="ml-2">
                  <span className="font-normal text-neutral-100/50">Directed by</span>{' '}
                  <span className="">{movie.directors.join(', ')}</span>
                </span>
              </div>
            </div>

            <MovieActivityStoreProvider initialActivity={initialActivity}>
              <div className="mt-2 flex items-center justify-start gap-2">
                <MovieActionsWatchButton />
                <MovieActionsLikeButton />
                <MovieActionsRatingInput />

                <MovieActivityStoreSubscriber />
              </div>
            </MovieActivityStoreProvider>
          </div>
        </div>
      </div>

      <div className="max-w-container mx-auto mt-4 grid w-full grid-cols-[minmax(240px,240px)_5fr] gap-8">
        <div className="col-start-2">
          <p className="text-neutral-400">{movie.overview}</p>

          {movie.genres && (
            <div className="mt-6 flex items-center gap-2 text-neutral-400">
              {movie.genres.map((genre) => (
                <MovieGenre key={genre} genre={genre} />
              ))}
              <DividerDot />
              <div className="text-sm font-medium">{runtimeMinutesToHours(movie.runtime)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-container mx-auto mb-8 w-full pt-16">
        <h2 className="mb-4 text-xl font-bold text-neutral-200">Cast</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <MovieViewCast movieId={movie.movieId} />
        </Suspense>
      </div>

      <div className="max-w-container mx-auto mb-[300px] w-full pt-16">
        <h2 className="mb-4 text-xl font-bold text-neutral-200">Watch</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <MovieViewStreaming movieId={movie.movieId} title={movie.title} />
        </Suspense>
      </div>
    </MovieProvider>
  );
};
