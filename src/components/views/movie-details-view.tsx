import { notFound } from 'next/navigation';
import { Image } from 'lucide-react';

import { tmdbGetMovieById } from '@/lib/tmdb/client';
import { backdropSrc, posterSrc } from '@/lib/utils';
import { MovieDetailsContextProvider } from '@/providers/movie-details-context-provider';
import { MovieWatchlistButton } from '../chat/movie-watchlist-button';
import { MovieDetailsOverlay } from '../movie/movie-details-overlay';

type Props = {
  movieId: number;
  isIntercepted: boolean;
};

export const MovieDetailsView = async ({ movieId, isIntercepted }: Props) => {
  const movie = await tmdbGetMovieById(movieId);

  if (!movie) {
    return notFound();
  }

  const directors = movie.credits?.crew?.filter((member) => member.job === 'Director') || [];

  return (
    <MovieDetailsContextProvider isIntercepted={isIntercepted}>
      <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-start justify-center overflow-y-auto p-2">
        <MovieDetailsOverlay />

        <div className="bg-background-1 relative z-50 mx-6 mt-6 mb-20 w-7xl rounded-lg pb-6 shadow-lg shadow-black/30">
          <div className="relative flex h-[520px] items-center overflow-clip rounded-t-lg">
            <img src={backdropSrc(movie.backdrop_path!, 'w1280')} className="w-full object-cover" />
            <div className="to-background-1 absolute bottom-0 h-full w-full bg-gradient-to-b from-transparent" />
          </div>

          <div className="relative z-50 mx-auto max-w-6xl">
            <div className="-mt-52 flex items-end gap-6">
              <div className="w-[220px] overflow-clip rounded-md">
                <img src={posterSrc(movie.poster_path!, 'w500')} />
              </div>

              <div className="mb-2 flex w-full items-end justify-between">
                <div className="flex w-full flex-col gap-1">
                  <h1 className="text-5xl font-black">
                    <span className="antialiased">{movie.title} </span>
                    <span className="text-foreground-1 ml-2 text-sm font-medium">
                      {new Date(movie.release_date!).getFullYear()}
                    </span>
                  </h1>

                  <div className="text-foreground-1 mt-1 flex items-center gap-2 text-sm font-medium">
                    <span>
                      {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A'}
                    </span>
                    <span>•</span>
                    <span>{movie.genres?.map((genre) => genre.name).join(', ')}</span>
                    <span>•</span>
                    <span>Dir. {directors.map((director) => director.name).join(', ')}</span>
                  </div>
                </div>

                <div className="ml-auto">
                  <MovieWatchlistButton tmdbId={movie.id} />
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-6">
              <div className="w-[220px]"></div>
              <div className="w-full">
                <p className="text-foreground-0/90 w-3/4 text-[15px] leading-6">{movie.overview}</p>
              </div>
            </div>

            <div className="mt-20">
              <h2 className="text-foreground-0/90 font-bold">Cast</h2>

              <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto">
                {movie.credits?.cast?.slice(0, 16).map((cast) => (
                  <div key={cast.id} className="mt-4 w-32 snap-start">
                    <div className="bg-background-2 relative h-44 w-32 overflow-clip rounded-md">
                      {cast.profile_path ? (
                        <img
                          src={posterSrc(cast.profile_path, 'w185')}
                          className="h-full w-full object-cover brightness-75"
                          alt={cast.name || ''}
                        />
                      ) : (
                        <div className="bg-background-3 text-foreground-3 flex h-full w-full items-center justify-center">
                          <Image />
                        </div>
                      )}
                    </div>
                    <div className="text-foreground-0 mt-2 text-sm font-medium">{cast.name}</div>
                    <div className="text-foreground-1 text-xs">{cast.character}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MovieDetailsContextProvider>
  );
};

//  <span className="text-foreground-1 text-base font-medium">
//                 {new Date(movie.release_date!).getFullYear()}
//               </span>
//               <span className="text-foreground-1 text-base font-medium">Directed by</span>
//               <span className="text-foreground-1 text-base font-medium">
//                 {directors.map((director) => director.name).join(', ')}
//               </span>

//  <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-start justify-center overflow-y-auto bg-black/50">
//       <div className="bg-background-1 my-12 w-7xl overflow-clip rounded-lg shadow shadow-black/30">
//         <div className="relative flex h-[620px] items-center overflow-clip">
//           <img src={backdropSrc(movie.backdrop_path!, 'w1280')} className="w-full object-cover" />
//           <div className="to-background-1 absolute bottom-0 h-full w-full bg-gradient-to-b from-transparent" />
//         </div>

//         <div className="relative -bottom-2 z-10 mx-auto -mt-[360px] grid w-full max-w-6xl grid-cols-[200px_1fr] gap-x-6 gap-y-4 p-8">
//           <img className="rounded-md shadow-lg shadow-black/40" src={posterSrc(movie.poster_path!, 'w500')} />
//           <div className="mb-2 flex flex-col justify-end">
//             <div className="mb-2 flex items-end text-5xl font-black">
//               <span className="antialiased">{movie.title} </span>
//               <span className="text-foreground-1 mb-0.5 ml-3 flex gap-1 text-sm font-medium">
//                 {new Date(movie.release_date!).getFullYear()}
//               </span>
//             </div>
//             <div className="text-foreground-1 flex gap-1 text-sm font-medium">
//               <span>{runtimeToHoursMins(movie.runtime!)}</span>
//               <span>•</span>
//               {movie.genres?.map((genre) => genreName(genre.name!)).join(', ')}
//               <span>•</span>
//               <span>
//                 Directed by <span className="">{directors.map((director) => director.name).join(', ')}</span>
//               </span>
//             </div>
//             <div className="flex justify-end gap-3">
//               <Button variant="primary" size="icon" className="!rounded-full">
//                 <Plus />
//               </Button>
//               <Button variant="ghost" size="icon" className="!rounded-full">
//                 <Eye />
//               </Button>
//               <Button variant="ghost" size="icon" className="!rounded-full">
//                 <Heart />
//               </Button>
//             </div>
//           </div>

//           <div></div>
//           <div className="text-foreground-0 text-sm leading-6">{movie.overview!}</div>

//           {/* <div className="cols-">
//             <h2>Cast</h2>
//           </div> */}
//         </div>
//       </div>
//     </div>
