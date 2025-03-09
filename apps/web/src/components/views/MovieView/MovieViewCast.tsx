import { TMDB_IMAGE_BASE_URL } from '@/lib/constants';
import { trpc } from '@/lib/trpc';

type MovieViewCastProps = {
  movieId: number;
};

export const MovieViewCast = async ({ movieId }: MovieViewCastProps) => {
  const cast = await trpc.movies.getMovieCast.query({ movieId });

  return (
    <div className="relative">
      <div className="no-scrollbar flex snap-x snap-mandatory scroll-px-8 gap-4 overflow-x-scroll px-4">
        {cast.slice(0, 30).map((person) => (
          <div key={person.id} className="shrink-0 snap-start first:ml-[-16px]">
            <div className="flex w-[10rem] h-[12rem] items-center justify-center overflow-clip rounded-md brightness-90 drop-shadow-md saturate-[.8]">
              <img className="mt-8" src={`${TMDB_IMAGE_BASE_URL}/w342/${person.profilePath}`} />
            </div>
            <div className="px-1 text-center">
              <div className="mt-2 text-sm font-semibold">{person.name}</div>
              <div className="text-text-muted text-sm">{person.character}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="from-bg-subtle/60 absolute top-0 left-0 h-full w-4 bg-linear-to-r to-transparent" />
      <div className="from-bg-subtle/60 absolute top-0 right-0 h-full w-4 bg-linear-to-l to-transparent" />
    </div>
  );
};
