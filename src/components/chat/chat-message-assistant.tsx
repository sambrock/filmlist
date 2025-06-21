import { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

type Props = React.ComponentProps<'div'> & {
  message: ChatMessage;
};

export const ChatMessageAssistant = ({ message, className, ...props }: Props) => {
  return (
    <div className={cn(className)} {...props}>
      {message.content}
      <div className="bg-surface-0 gap-2 rounded-lg p-2">
        {message.movies.map((movie) => (
          <div key={movie.tmdbId} className="w-[200px] overflow-clip rounded-md">
            <img
              className="h-full object-cover"
              src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
              alt={movie.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
