'use client';

import type { Message, MessageMovie, Movie } from '@/lib/drizzle/zod';
import { Prettify } from '@/lib/utils/type.utils';

type Props = {
  message: Partial<Message>;
  movies?: Prettify<Partial<MessageMovie> & { movie?: Movie }>[];
};

export const ChatMessageAssistant = ({ message, movies = [] }: Props) => {
  console.log(message);
  return (
    <div className="space-y-4 pb-8">
      {movies.map((movie, index) => (
        <div key={index}>
          <div>{movie.movie?.tmdbId}</div>
          <div>{movie.title}</div>
          <div>{movie.releaseYear}</div>
          <div>{movie.why}</div>
        </div>
      ))}
    </div>
  );
};
