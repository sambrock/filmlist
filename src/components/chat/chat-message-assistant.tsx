'use client';

import type { MessageAssistant } from '@/lib/drizzle/types';
import { Model, models } from '@/lib/models';
import { cn } from '@/lib/utils';
import { SpinnerEllipsis } from '../common/spinner';
import { ChatMovie } from './chat-movie';

type Props = {
  message: MessageAssistant;
} & React.ComponentProps<'div'>;

export const ChatMessageAssistant = ({ message, className, ...props }: Props) => {
  return (
    <div className={cn('mb-10', className)} {...props} data-message-id={message.messageId}>
      {message.status === 'pending' && !message.structured && (
        <SpinnerEllipsis className="text-foreground-1 mt-4" />
      )}

      {message.structured && (
        <div className="bg-background-0 overflow-clip rounded-xl">
          {message.structured.map((structured, index) => (
            <ChatMovie
              key={index}
              title={structured.title}
              releaseYear={structured.releaseYear}
              why={structured.why}
              movie={message.movies?.find((m) => m.tmdbId === structured.tmdbId)}
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          'text-foreground-1 mt-4 flex px-2 text-xs',
          message.status === 'done' ? 'visible' : 'invisible'
        )}
      >
        <span className="font-medium">{models.get(message.model as Model)?.name}</span>
      </div>
    </div>
  );
};
