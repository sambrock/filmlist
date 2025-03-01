import type { Movie, UserMovieActivity } from '@filmlist/api/app.types';
import { cn } from '@/lib/utils/cn';
import { runtimeMinutesToHours } from '@/lib/utils/runtime';
import { MovieActivityStoreProvider } from '@/providers/MovieActivityStoreProvider';
import { MovieProvider } from '@/providers/MovieProvider';
import { DividerDot } from '../common/Divider';
import { MovieActionLikeButton, MovieActionWatchButton } from '../movie-actions/MovieActions';
import { MovieActivityStoreSubscriber } from '../movie-actions/MovieActivityStoreSubscriber';
import { MovieActionsRating } from '../movie-actions/MoviesActionsRating';
import { MovieBackdropImage } from '../movie/MovieBackdrop';
import { MovieGenre } from '../movie/MovieGenre';
import { MoviePoster } from '../movie/MoviePoster';

type MovieViewProps = {
  movie: Movie;
  initialActivity: UserMovieActivity;
};

export const MovieView = ({ movie, initialActivity }: MovieViewProps) => {
  return (
    <MovieProvider movie={movie}>
      <MovieActivityStoreProvider initialActivity={initialActivity}>
        <div className="relative">
          <div className="flex h-[calc(100vh-200px)] justify-center overflow-clip">
            <MovieBackdropImage
              className="backdrop-scroll-animation w-full object-cover"
              backdropPath={movie.backdropPath}
            />
          </div>

          <div className="from-bg-subtle absolute -bottom-[2px] left-0 h-full w-full bg-linear-to-t to-transparent" />

          <MovieViewGrid className="px-margin absolute bottom-0 left-1/2 container mb-6 -translate-x-1/2 gap-8">
            <MoviePoster
              className="self-end rounded-lg object-cover drop-shadow-xl"
              posterPath={movie.posterPath}
            />

            <div className="mt-24 flex w-full flex-col gap-2 self-end">
              <div className="wrap flex items-baseline">
                <h1
                  className="leading-10 font-black antialiased drop-shadow-md"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                >
                  {movie.title}
                </h1>

                <div className="text-text-default/60 ml-4 text-base font-medium">
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  <span className="ml-2">
                    <span className="text-text-default/40 font-normal">Directed by</span>{' '}
                    <span className="">{movie.directors.join(', ')}</span>
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-start gap-2">
                <MovieActionWatchButton />
                <MovieActionLikeButton />
                <MovieActionsRating />
              </div>
            </div>
          </MovieViewGrid>
        </div>

        <div className="px-margin container mx-auto mt-4 debug">
          <MovieViewGrid className="gap-8">
            <div></div>
            <div>
              <p className="text-text-muted w-full 2xl:w-4/6">{movie.overview}</p>

              {movie.genres && (
                <div className="text-text-muted mt-6 flex items-center gap-2">
                  {movie.genres.map((genre) => (
                    <MovieGenre key={genre} genre={genre} />
                  ))}
                  <DividerDot />
                  <div className="text-sm font-medium">{runtimeMinutesToHours(movie.runtime)}</div>
                </div>
              )}
            </div>
            <div className="debug"></div>
            <div className="debug">
              <h2 className="mx-auto mt-20 mb-4 px-8 text-2xl font-bold">Cast</h2>

              <div className="relative debug overflow-x-scroll">
                <div className="mb-[400px] w-full debug flex snap-x snap-mandatory scroll-p-[5rem] items-center gap-4 overflow-x-scroll">
                  <div className="aspect-square w-[240px] shrink-0 snap-start rounded-md bg-white/10"></div>
                  <div className="aspect-square w-[240px] shrink-0 snap-start rounded-md bg-white/10"></div>
                  <div className="aspect-square w-[240px] shrink-0 snap-start rounded-md bg-white/10"></div>
                  <div className="aspect-square w-[240px] shrink-0 snap-start rounded-md bg-white/10"></div>
                  <div className="aspect-square w-[240px] shrink-0 snap-start rounded-md bg-white/10"></div>
                  <div className="aspect-square w-[240px] shrink-0 snap-start rounded-md bg-white/10"></div>
                  <div className="aspect-square w-[240px] shrink-0 snap-start rounded-md bg-white/10"></div>
                  <div className="aspect-square w-[240px] shrink-0 snap-start rounded-md bg-white/10"></div>
                  <div className="aspect-square w-[240px] shrink-0 snap-start rounded-md bg-white/10"></div>
                  <div className="aspect-square w-[240px] shrink-0 snap-start rounded-md bg-white/10"></div>
                </div>
                <div className="from-bg-subtle absolute top-0 -left-[2px] z-10 h-full w-[4rem] bg-linear-to-r to-transparent"></div>
                <div className="from-bg-subtle absolute top-0 -right-[2px] z-10 h-full w-[4rem] bg-linear-to-l to-transparent"></div>
              </div>
            </div>
          </MovieViewGrid>
        </div>

        <MovieActivityStoreSubscriber />
      </MovieActivityStoreProvider>
    </MovieProvider>
  );
};

const MovieViewGrid = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div className={cn('grid grid-cols-[minmax(240px,240px)_5fr]', className)} {...props}>
      {props.children}
    </div>
  );
};
