import type { MessageAssistant } from '@/drizzle';
import { posterSrc, runtimeToHoursMins } from '@/lib/utils';

type Props = {
  recommendation: MessageAssistant['recommendations'][number];
};

export const ChatMessageRecommendation = ({ recommendation }: Props) => {
  const movie = recommendation.movie;

  return (
    <div className="bg-background-3/50 flex gap-4 rounded-md p-1">
      <div className="bg-background-1/5 aspect-[1/1.5] w-22 shrink-0 overflow-clip rounded-sm shadow-md shadow-black/30">
        <img
          className="h-full object-cover"
          src={posterSrc(movie!.source.poster_path as string, 'w185')}
          alt={recommendation.title}
        />
      </div>

      <div className="flex flex-col pt-4">
        <div className="mb-1 flex items-baseline gap-2">
          <div className="font-semibold">{recommendation.title}</div>
          <span className="text-foreground-1 text-sm font-medium">
            {recommendation.releaseYear ? new Date(recommendation.releaseYear as string).getFullYear() : ''}
          </span>
        </div>

        <div className="text-foreground-1 max-w-lg text-sm">{recommendation.why}</div>

        <div className="text-foreground-1 mt-auto flex gap-1 pb-2 text-xs font-medium">
          <div>{runtimeToHoursMins(movie!.source.runtime)}</div>
          <div>·</div>
          {movie!.source.genres?.map((genre) => <div key={genre.id}>{genre.name}</div>)}
        </div>
      </div>
    </div>
  );
};

export const ChatMessageRecommendationPending = ({
  recommendation,
}: {
  recommendation: Partial<MessageAssistant['recommendations'][number]>;
}) => {
  return (
    <div className="bg-background-3/50 flex gap-4 rounded-md p-1">
      <div className="bg-background-1/50 aspect-[1/1.5] w-22 shrink-0 overflow-clip rounded-sm"></div>

      <div className="flex flex-col pt-4">
        <div className="mb-1 flex items-baseline gap-2">
          <div className="font-semibold">{recommendation.title}</div>
          <span className="text-foreground-1 text-sm font-medium">
            {recommendation.releaseYear ? new Date(recommendation.releaseYear as string).getFullYear() : ''}
          </span>
        </div>

        <div className="text-foreground-1 max-w-lg text-sm">{recommendation.why}</div>

        {/* <div className="bg-background-3/50 mt-auto h-6 w-32 animate-pulse rounded-sm"></div> */}
      </div>
    </div>
  );
};
