'use client';

import { cn } from '@/lib/utils/cn';

type Props = React.ComponentProps<'input'>;

export const MessageInput = ({ className, ...props }: Props) => {
  return <input className={cn('bg-surface-2 w-full rounded-md px-2 py-3', className)} {...props} />;
};
