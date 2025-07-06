'use client';

import { Fragment } from 'react';

import type { Message, Movie } from '@/lib/drizzle/zod';
import { formatContent } from '@/lib/utils/chat.utils';
import { ChatMessageMovies } from './chat-message-movies';

type Props = {
  message: Partial<Message> & { content: string };
  movies: Movie[];
};

export const ChatMessageAssistant = ({ message, movies }: Props) => {
  const formatted = formatContent(message.content);

  return formatted.map((part, index) => (
    <Fragment key={index}>
      {part.type === 'TEXT' && <div dangerouslySetInnerHTML={{ __html: part.html }} />}
      {part.type === 'MOVIES' && <ChatMessageMovies movies={movies} />}
    </Fragment>
  ));
};
