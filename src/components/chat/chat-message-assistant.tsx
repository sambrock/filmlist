import { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

type Props = React.ComponentProps<'div'> & {
  message: ChatMessage;
};

export const ChatMessageAssistant = ({ message, className, ...props }: Props) => {
  return (
    <div className={cn(className)} {...props}>
      {message.content}
      <ul className="bg-background-0 grid w-3xl snap-mandatory grid-cols-4 items-center gap-3 overflow-x-scroll rounded-xl p-3">
        {message.movies.slice(0, 4).map((movie) => (
          <li key={movie.tmdbId} className="overflow-clip rounded-md">
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
