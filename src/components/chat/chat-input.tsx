'use client';

import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { clearUuid } from '@/lib/utils/uuid';
import { useChatStore } from '@/providers/chat-store-provider';
import { useChatMutation } from '@/hooks/useChatMutation';
import { Button } from '../common/button';
import { ChatModelSelect } from './chat-model-select';

type Props = {} & React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const [threadId, value, setValue] = useChatStore((store) => [
    store.threadId,
    store.value,
    store.actions.setValue,
  ]);

  const chatMutation = useChatMutation();

  const handleSubmit = () => {
    chatMutation.mutate(value);
    setValue('');
    window.history.pushState({}, '', `/chat/${clearUuid(threadId)}`);
    // Scroll to the bottom of the chat
    document.getElementById('chat-messages-end')?.scrollIntoView({ behavior: 'instant' });
  };

  return (
    <div
      className={cn('border-foreground-0/5 bg-background-2 flex flex-col rounded-xl border px-2', className)}
      {...props}
    >
      <textarea
        className="text-foreground-0 placeholder:text-foreground-0/35 my-2 w-full resize-none px-2 py-2 text-base focus:outline-none"
        placeholder="Type your message..."
        rows={1}
        value={value}
        autoFocus
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />

      <div className="flex items-center gap-1 py-1 pb-1">
        <ChatModelSelect />
        <Button className="ml-auto" size="icon" variant="ghost">
          <ArrowUp className="size-5" />
        </Button>
      </div>
    </div>
  );
};
