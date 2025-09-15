import { notFound } from 'next/navigation';
import { Eye, Heart, Plus } from 'lucide-react';

import { tmdbGetMovieById } from '@/lib/tmdb/client';
import { backdropSrc, genreName, posterSrc, runtimeToHoursMins } from '@/lib/utils';
import { Button } from '../common/button';

type Props = {
  movieId: number;
};

export const MovieDetailsView = async ({ movieId }: Props) => {
  const movie = await tmdbGetMovieById(movieId);

  if (!movie) {
    return notFound();
  }

  const directors = movie.credits?.crew?.filter((member) => member.job === 'Director') || [];

  return (
    <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-start justify-center overflow-y-auto bg-black/50">
      <div className="bg-background-1 my-12 w-7xl overflow-clip rounded-lg shadow shadow-black/30">
        <div className="relative flex h-[620px] items-center overflow-clip">
          <img src={backdropSrc(movie.backdrop_path!, 'w1280')} className="object-cover w-full" />
          <div className="to-background-1 absolute bottom-0 h-full w-full bg-gradient-to-b from-transparent" />
        </div>

        <div className="relative -bottom-2 z-10 mx-auto -mt-[360px] grid w-full max-w-6xl grid-cols-[200px_1fr] gap-x-6 gap-y-4 p-8">
          <img className="rounded-md shadow-lg shadow-black/40" src={posterSrc(movie.poster_path!, 'w500')} />
          <div className="mb-2 flex flex-col justify-end">
            <div className="mb-2 flex items-end text-5xl font-black">
              <span className="antialiased">{movie.title} </span>
              <span className="text-foreground-1 mb-0.5 ml-3 flex gap-1 text-sm font-medium">
                {new Date(movie.release_date!).getFullYear()}
              </span>
            </div>
            <div className="text-foreground-1 flex gap-1 text-sm font-medium">
              <span>{runtimeToHoursMins(movie.runtime!)}</span>
              <span>•</span>
              {movie.genres?.map((genre) => genreName(genre.name!)).join(', ')}
              <span>•</span>
              <span>
                Directed by <span className="">{directors.map((director) => director.name).join(', ')}</span>
              </span>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="primary" size="icon" className="!rounded-full">
                <Plus />
              </Button>
              <Button variant="ghost" size="icon" className="!rounded-full">
                <Eye />
              </Button>
              <Button variant="ghost" size="icon" className="!rounded-full">
                <Heart />
              </Button>
            </div>
          </div>

          <div></div>
          <div className="text-foreground-0 text-sm leading-6">{movie.overview!}</div>

          {/* <div className="cols-">
            <h2>Cast</h2>
          </div> */}
        </div>
      </div>
    </div>
  );
};

//  <span className="text-foreground-1 text-base font-medium">
//                 {new Date(movie.release_date!).getFullYear()}
//               </span>
//               <span className="text-foreground-1 text-base font-medium">Directed by</span>
//               <span className="text-foreground-1 text-base font-medium">
//                 {directors.map((director) => director.name).join(', ')}
//               </span>
