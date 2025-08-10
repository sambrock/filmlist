'use client';

import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { clearUuid } from '@/lib/utils/uuid';
import { useChatStore } from '@/providers/chat-store-provider';
import { useChatStream } from '@/hooks/useChatStream';
import { Button } from '../common/button';

type Props = {} & React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const [threadId, value, setValue] = useChatStore((store) => [
    store.threadId,
    store.value,
    store.actions.setValue,
  ]);

  const chatStream = useChatStream();

  const handleSubmit = () => {
    chatStream.mutate(value);
    window.history.pushState({}, '', `/chat/${clearUuid(threadId)}`);
  };

  return (
    <div
      className={cn(
        'border-foreground-0/5 bg-background-2 flex items-center rounded-4xl border border-x border-t px-2',
        className
      )}
      {...props}
    >
      <input
        className="text-foreground-0 placeholder:text-foreground-0/40 w-full px-4 py-4 text-base focus:outline-none"
        placeholder="Type your message here..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) {
            handleSubmit();
          }
        }}
      />
      <div className="ml-auto flex items-center">
        <Button size="icon" variant="primary">
          <ArrowUp className="size-5" />
        </Button>
      </div>
    </div>
  );
};
