'use client';

import { Doc } from '@/infra/convex/_generated/dataModel';
import { cn, genreName, posterSrc, runtimeToHoursMins } from '@/lib/utils';
import { TooltipProvider } from '../common/tooltip';
import { MovieWatchlistButton } from './movie-watchlist-button';

type Props = {
  movie: NonNullable<Doc<'messages'>['movies']>[number];
};

export const MessageMovie = ({ movie }: Props) => {
  return (
    <div className="group border-foreground-0/5 flex cursor-pointer border-b-1 px-2 py-2 last:border-0">
      <ChatMoviePoster posterPath={movie.found ? movie.posterPath : ''} alt={movie.title} />

      <div className="ml-4 flex w-full flex-col py-2">
        <div className="mb-1 font-semibold">
          {movie.title}{' '}
          <span className="text-foreground-1 ml-1 text-xs font-medium">
            {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''}
          </span>
        </div>
        <div className="text-foreground-1 max-w-3/4 text-sm">{movie.why}</div>
        <div className="mt-auto flex items-baseline">
          {movie.found && (
            <div className="text-foreground-1 mt-auto flex gap-1 text-xs font-medium">
              <span>{runtimeToHoursMins(movie.runtime!)}</span>
              <span>•</span>
              {movie.genres.map((genre) => genreName(genre)).join(', ')}
            </div>
          )}
          {movie.found && (
            <TooltipProvider>
              <div className="-mb-2 ml-auto flex items-center gap-1">
                <MovieWatchlistButton tmdbId={movie.tmdbId} />
              </div>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatMoviePoster = ({ posterPath, alt }: { posterPath: string; alt: string }) => {
  return (
    <div className={cn('bg-background-4 aspect-[1/1.5] w-26 overflow-clip rounded-sm')}>
      {posterPath && <img className="object-fit" src={posterSrc(posterPath, 'w185')} alt={alt} />}
    </div>
  );
};

// const ChatMovieWatchlistButton = ({ movie }: { movie: MessageAssistant['movies'][number] }) => {
//   const { mutate } = useApiUpdateLibrary();

//   return (
//     <Tooltip>
//       <TooltipTrigger asChild>
//         <Button
//           variant={movie.watchlist ? 'primary' : 'ghost-2'}
//           size="icon"
//           className="rounded-full!"
//           onClick={() => {
//             mutate({ movieId: movie.movieId, watchlist: !movie.watchlist });
//           }}
//         >
//           <Plus className="size-5" />
//         </Button>
//       </TooltipTrigger>
//       <TooltipContent>{movie.watchlist ? 'Remove from watchlist' : 'Add to watchlist'}</TooltipContent>
//     </Tooltip>
//   );
// };

// const ChatMovieWatchButton = ({ movie }: { movie: MessageAssistant['movies'][number] }) => {
//   const { mutate } = useApiUpdateLibrary();

//   return (
//     <Tooltip>
//       <TooltipTrigger asChild>
//         <Button
//           variant={movie.watched ? 'primary' : 'ghost-2'}
//           size="icon"
//           className="rounded-full!"
//           onClick={() => {
//             mutate({ movieId: movie.movieId, watched: !movie.watched });
//           }}
//         >
//           <Eye className="size-5" />
//         </Button>
//       </TooltipTrigger>
//       <TooltipContent>{movie.watched ? 'Remove from watched' : 'Add to watched'}</TooltipContent>
//     </Tooltip>
//   );
// };

// const ChatMovieLikeButton = ({ movie }: { movie: MessageAssistant['movies'][number] }) => {
//   const { mutate } = useApiUpdateLibrary();

//   return (
//     <Tooltip>
//       <TooltipTrigger asChild>
//         <Button
//           variant={movie.liked ? 'primary' : 'ghost-2'}
//           size="icon"
//           className="rounded-full!"
//           onClick={() => {
//             mutate({ movieId: movie.movieId, liked: !movie.liked });
//           }}
//         >
//           <Heart className="size-5" />
//         </Button>
//       </TooltipTrigger>
//       <TooltipContent>{movie.liked ? 'Remove from liked' : 'Add to liked'}</TooltipContent>
//     </Tooltip>
//   );
// };
