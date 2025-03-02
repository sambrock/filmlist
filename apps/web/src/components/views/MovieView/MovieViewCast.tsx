import { TMDB_IMAGE_BASE_URL } from '@/lib/constants';
import { trpc } from '@/lib/trpc';

type MovieViewCastProps = {
  movieId: number;
};

export const MovieViewCast = async ({ movieId }: MovieViewCastProps) => {
  const cast = await trpc.movies.getMovieCast.query({ movieId });

  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-scroll">
      {cast.slice(0, 10).map((person) => (
        <div key={person.id} className="w-[10rem] shrink-0 snap-start">
          <div className="h-[200px] overflow-clip rounded-md brightness-90 drop-shadow-md">
            <img src={`${TMDB_IMAGE_BASE_URL}/w342/${person.profilePath}`} />
          </div>
          <div className="px-1">
            <div className="mt-2 text-sm font-semibold">{person.name}</div>
            <div className="text-text-muted text-sm">{person.character}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
