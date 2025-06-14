import { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

type Props = React.ComponentProps<'div'> & {
  message: ChatMessage;
};

export const ChatMessageAssistant = ({ message, className, ...props }: Props) => {
  return (
    <div className={cn(className)} {...props}>
      {message.content}
      {message.movies.map((movie) => (
        <div key={movie.tmdbId} className="mt-2">
          <div className="font-semibold">{movie.title}</div>
          <div className="text-sm text-gray-500">
            Release Year: {new Date(movie.releaseDate).getFullYear()}
          </div>
          <div className="text-sm text-gray-500">TMDB ID: {movie.tmdbId}</div>
        </div>
      ))}
    </div>
  );
};
