import { forwardRef } from 'react';

import { cn } from '@/lib/utils/cn';

export const Input = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'h-input-sm placeholder:text-neutral-500 rounded-md px-3 text-sm focus:outline-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
