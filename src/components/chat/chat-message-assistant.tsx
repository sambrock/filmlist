'use client';

import type { MessageAssistant } from '@/lib/drizzle/types';
import { cn } from '@/lib/utils/cn';
import { Spinner } from '../common/spinner';
import { ChatMovie } from './chat-movie';

type Props = {
  message: MessageAssistant;
} & React.ComponentProps<'div'>;

export const ChatMessageAssistant = ({ message, className, ...props }: Props) => {
  return (
    <div className={cn('mb-10', className)} {...props}>
      {message.structured && (
        <div className="bg-background-0 rounded-xl">
          {message.structured.map((structured, index) => (
            <ChatMovie
              key={index}
              title={structured.title}
              releaseYear={structured.releaseYear}
              why={structured.why}
              messageStatus={message.status}
              movie={message.movies?.find((m) => m.tmdbId === structured.tmdbId)}
            />
          ))}
        </div>
      )}

      {message.status === 'pending' && !message.structured && <Spinner className="text-foreground-1 mt-4" />}
    </div>
  );
};
