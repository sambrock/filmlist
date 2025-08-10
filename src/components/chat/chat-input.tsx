'use client';

import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { useChatStore } from '@/providers/chat-store-provider';
import { Button } from '../common/button';

type Props = {} & React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const [value, setValue] = useChatStore((store) => [store.value, store.actions.setValue]);

  return (
    <div
      className={cn(
        'border-foreground-0/5 bg-background-2/20 min-h-30 rounded-t-3xl border border-x border-t px-2 pt-2',
        className
      )}
      {...props}
    >
      <div className="bg-background-2/90 border-foreground-0/10 absolute top-2 left-2 flex h-full w-[calc(100%-theme(spacing.4))] flex-col rounded-t-2xl border-x border-t shadow-md shadow-black/30">
        <input
          className="text-foreground-0 placeholder:text-foreground-0/40 w-full px-4 py-4 text-base focus:outline-none"
          placeholder="Type your message here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="mt-auto flex items-center justify-end px-2 pb-4">
          <Button size="icon" variant="primary" className="ml-auto">
            <ArrowUp className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
