'use client';

import type { Message, Movie } from '@/lib/drizzle/zod';
import { convertMarkdownContentToHtml } from '@/lib/utils/chat.utils';

type Props = {
  message: Partial<Message>;
  movies: Movie[];
};

const jsonCodeRegex = /\`\`\`(?:\w+\n)?([\s\S]*?)\`\`\`/g;

export const ChatMessageAssistant = ({ message, movies }: Props) => {
  const content = message.content?.split(jsonCodeRegex);

  return (
    <div>
      {message.content}
      {content?.[0] && (
        <div dangerouslySetInnerHTML={{ __html: convertMarkdownContentToHtml(content[0]) }}></div>
      )}

      <div className="bg-background-0 my-4 rounded-lg">
        {movies.map((movie) => (
          <div key={movie.movieId} className="mt-2">
            {movie.tmdbId}
            {movie.title}
          </div>
        ))}
      </div>

      {content?.[2] && (
        <div dangerouslySetInnerHTML={{ __html: convertMarkdownContentToHtml(content[2]) }}></div>
      )}
    </div>
  );
};
