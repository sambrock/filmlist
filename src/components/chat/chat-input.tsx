'use client';

import { ArrowUp, ChevronDown } from 'lucide-react';

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

    // Scroll to the bottom of the chat
    document.getElementById('chat-messages-end')?.scrollIntoView({ behavior: 'instant' });
  };

  return (
    <div
      className={cn(
        'border-foreground-0/5 bg-background-2 flex h-14 items-center rounded-4xl border border-x border-t px-2',
        className
      )}
      {...props}
    >
      <input
        className="text-foreground-0 placeholder:text-foreground-0/50 h-full w-full px-4 text-base focus:outline-none"
        placeholder="Type your message..."
        value={value}
        autoFocus
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) {
            handleSubmit();
          }
        }}
      />
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" pill>
          gpt-4.1-nano
          <ChevronDown className="ml-1 size-5" />
        </Button>
        <Button size="icon" variant="ghost" pill>
          <ArrowUp className="size-5" />
        </Button>
      </div>
    </div>
  );
};
