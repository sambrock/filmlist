import type { RecommendationWithMovie } from '@/lib/drizzle';
import { posterSrc, runtimeToHoursMins } from '@/lib/utils';

type Props = {
  recommendation: RecommendationWithMovie;
};

export const ChatMessageRecommendation = ({ recommendation }: Props) => {
  const movie = recommendation.movie.source;

  return (
    <div className="bg-background-3/50 flex gap-4 rounded-md p-1">
      <div className="w-22 shrink-0 overflow-clip rounded-sm shadow-md shadow-black/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="h-full object-cover"
          src={posterSrc(movie.poster_path as string, 'w185')}
          alt={movie.title}
        />
      </div>
      <div className="flex flex-col pt-4">
        <div className="mb-1 flex items-baseline font-semibold">
          {recommendation.title}
          <span className="text-foreground-1 ml-2 text-sm font-medium">
            {new Date(movie.release_date as string).getFullYear()}
          </span>
        </div>

        <div className="text-foreground-1 max-w-lg text-sm">{recommendation.why}</div>

        <div className="text-foreground-1 mt-auto flex gap-1 pb-2 text-xs font-medium">
          <div>{runtimeToHoursMins(movie.runtime)}</div>
          <div>·</div>
          {movie.genres?.map((genre) => <div key={genre.id}>{genre.name}</div>)}
        </div>
      </div>
    </div>
  );
};
