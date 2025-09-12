'use client';

import { Model, models } from '@/lib/models';
import { cn } from '@/lib/utils';
import { useMessageContext } from '@/providers/message-context-provider';

export const MessageAssistantActions = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { message } = useMessageContext();

  return (
    <div
      className={cn(
        'text-foreground-1 mt-4 flex px-2 text-xs',
        message.status === 'done' ? 'visible' : 'invisible',
        className
      )}
      {...props}
    >
      <span className="font-medium">{models.get(message.model as Model)?.name}</span>
    </div>
  );
};
