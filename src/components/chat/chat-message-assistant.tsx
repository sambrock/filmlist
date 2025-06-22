import { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

type Props = React.ComponentProps<'div'> & {
  message: ChatMessage;
};

export const ChatMessageAssistant = ({ message, className, ...props }: Props) => {
  return (
    <div className={cn(className)} {...props}>
      {message.content}
      <ul className="flex w-3xl snap-x snap-mandatory items-center gap-4 overflow-x-scroll rounded-lg">
        {message.movies.map((movie) => (
          <li key={movie.tmdbId} className="w-[190px] shrink-0 snap-start overflow-clip rounded-md">
            <img
              className="h-full object-cover"
              src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
              alt={movie.title}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
