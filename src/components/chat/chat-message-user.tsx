'use client';

import type { MessageUser } from '@/lib/drizzle/types';
import { cn } from '@/lib/utils/cn';

type Props = {
  message: MessageUser;
} & React.ComponentProps<'div'>;

export const ChatMessageUser = ({ message, className, ...props }: Props) => {
  return (
    <div
      className={cn('bg-background-3 mb-6 ml-auto w-min rounded-full px-3 py-2 whitespace-nowrap', className)}
      {...props}
    >
      {message.content}
    </div>
  );
};
