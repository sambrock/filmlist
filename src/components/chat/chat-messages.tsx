'use client';

import { useLayoutEffect, useRef } from 'react';
import { useQuery } from 'convex/react';

import { api } from '@/infra/convex/_generated/api';
import { Doc } from '@/infra/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { MessageContextProvider } from '@/providers/message-context-provider';
import { useThreadContext } from '@/providers/thread-context-provider';
import { MessageAssistant } from './message-assistant';
import { MessageUser } from './message-user';

type Props = {
  initialData: Doc<'messages'>[];
} & React.ComponentProps<'div'>;

export const ChatMessages = ({ initialData, className, ...props }: Props) => {
  const { threadId } = useThreadContext();

  const messages = useQuery(api.messages.getByThreadId, { threadId }) || initialData;

  const divRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
    }
  }, [messages.length]);

  return (
    <div id="chatMessages" ref={divRef} className={cn('mt-20 lg:mt-8 space-y-4 pb-36', className)} {...props}>
      {messages.map((message) => (
        <MessageContextProvider key={message.messageId} message={message}>
          {message.role === 'user' && <MessageUser />}
          {message.role === 'assistant' && <MessageAssistant />}
        </MessageContextProvider>
      ))}
    </div>
  );
};
