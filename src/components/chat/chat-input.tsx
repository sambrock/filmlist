'use client';

import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useThreadContext } from '@/providers/thread-context-provider';
import { useApiSendMessage } from '@/hooks/use-api-send-message';
import { Button } from '../common/button';
import { ChatModelSelect } from './chat-model-select';

type Props = React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const { threadId, getThreadIsPersisted } = useThreadContext();

  const value = useGlobalStore((s) =>
    getThreadIsPersisted() ? (s.chatInputValue.get(threadId) ?? '') : (s.chatInputValue.get('new') ?? '')
  );
  const isPending = useGlobalStore((s) => s.chatPending.has(threadId));
  const dispatch = useGlobalStore((s) => s.dispatch);

  const isDisabled = isPending || !value.trim();

  const sendMessage = useApiSendMessage();

  return (
    <div
      className={cn(
        'border-foreground-0/5 bg-background-2 flex flex-col rounded-xl border px-2',

        className
      )}
      {...props}
    >
      <textarea
        className="text-foreground-0 placeholder:text-foreground-0/35 my-2 w-full resize-none px-2 py-2 text-base focus:outline-none"
        placeholder="Type your message..."
        value={value}
        rows={1}
        autoFocus
        onChange={(e) => {
          dispatch({
            type: 'SET_INPUT_VALUE',
            payload: { threadId, value: e.target.value, isPersisted: getThreadIsPersisted() },
          });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage.mutate(value);
          }
        }}
      />

      <div className="flex items-center gap-1 py-1 pb-1">
        <ChatModelSelect />

        <Button
          className={cn('ml-auto', isDisabled && 'pointer-events-none')}
          size="icon"
          variant="ghost"
          disabled={isDisabled}
        >
          <ArrowUp className="size-5" />
        </Button>
      </div>
    </div>
  );
};
