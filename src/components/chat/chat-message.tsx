'use client';

import { useRef } from 'react';
import { useHover } from 'usehooks-ts';

import { MessageAssistant, MessageUser, Movie } from '@/lib/drizzle/types';
import { Model, models } from '@/lib/models';
import { cn } from '@/lib/utils/cn';
import { Spinner } from '../common/spinner';
import { ChatMovie } from './chat-movie';

type Props = {
  messageUser: MessageUser;
  messageAssistant: MessageAssistant;
  movies: Movie[];
};

export const ChatMessage = ({ messageUser, messageAssistant, movies }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(divRef as React.RefObject<HTMLDivElement>);

  const isPending = messageAssistant.status === 'pending' && !messageAssistant.structured;
  const isDone = messageAssistant.status === 'done';

  return (
    <div ref={divRef} className="mb-10 flex flex-col">
      <div className="bg-background-3 mb-6 ml-auto w-min max-w-2/3 rounded-xl px-3 py-2 whitespace-nowrap">
        {messageUser.content}
      </div>

      {isPending && <Spinner className="text-foreground-1" />}

      <div>
        {messageAssistant.structured && (
          <div className="bg-background-5 rounded-xl">
            {messageAssistant.structured.map((structured, index) => (
              <ChatMovie
                key={index}
                title={structured.title}
                releaseYear={structured.releaseYear}
                why={structured.why}
                messageStatus={messageAssistant.status}
                movie={movies?.find((m) => m.tmdbId === structured.tmdbId)}
              />
            ))}
          </div>
        )}
      </div>

      <div
        className={cn(
          'text-foreground-1 mt-4 flex px-2 text-xs',
          isHover && isDone ? 'visible' : 'invisible'
        )}
      >
        <span className="font-medium">{models.get(messageAssistant.model as Model)?.name}</span>
      </div>
    </div>
  );
};
