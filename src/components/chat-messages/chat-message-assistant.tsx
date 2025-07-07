'use client';

import type { Message, Movie } from '@/lib/drizzle/zod';
import { formatContent } from '@/lib/utils/chat.utils';
import { ChatMessageMovies } from './chat-message-movies';

type Props = {
  message: Partial<Message> & { content: string };
  movies: Movie[];
};

export const ChatMessageAssistant = ({ message, movies }: Props) => {
  const formatted = formatContent(message.content);

  return (
    <div className="space-y-4">
      {formatted.map((part, index) => (
        <div key={index} className="">
          {part.type === 'TEXT' && <div dangerouslySetInnerHTML={{ __html: part.html }} />}
          {part.type === 'MOVIES' && <ChatMessageMovies movies={movies} />}
        </div>
      ))}
    </div>
  );
};
