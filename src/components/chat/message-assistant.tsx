'use client';

import { useCallback, useLayoutEffect } from 'react';

import { cn, modelResponseTextToMoviesArr } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useMessageContext } from '@/providers/message-context-provider';
import { SpinnerEllipsis } from '../common/spinner';
import { MessageAssistantActions } from './message-assistant-actions';
import { MessageMovie } from './message-movie';

type Props = React.ComponentProps<'div'>;

export const MessageAssistant = ({ className, ...props }: Props) => {
  const { message } = useMessageContext();
  const pendingContent = useGlobalStore((s) => s.messagePendingContent.get(message.messageId));

  const getMovies = useCallback(() => {
    if (message.movies) {
      return message.movies;
    }
    // Pending messages do not have movies yet,
    // but we can derive them partially from the pending content
    if (message.status === 'pending' && pendingContent) {
      return modelResponseTextToMoviesArr(pendingContent);
    }
    return [];
  }, [message.movies, message.status, pendingContent]);

  useLayoutEffect(() => {
    if (document.getElementById('chatMessages') && pendingContent) {
      document.getElementById('chatMessages')?.scrollIntoView({ behavior: 'instant', block: 'end' });
    }
  }, [pendingContent]);

  return (
    <div className={cn('mb-10', className)} {...props} data-message-id={message.messageId}>
      {message.status === 'pending' && getMovies().length === 0 && (
        <SpinnerEllipsis className="text-foreground-1 size-10" />
      )}

      {getMovies().length > 0 && (
        <div className="bg-background-0 overflow-clip rounded-xl">
          {getMovies().map((movie, index) => (
            <MessageMovie key={index} movie={movie} />
          ))}
        </div>
      )}

      <MessageAssistantActions />
    </div>
  );
};
