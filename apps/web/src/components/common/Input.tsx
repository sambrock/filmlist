import { forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const variants = cva(
  'h-input-md rounded-md  bg-neutral-900 px-3 text-sm placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500/40 focus:outline-none',
  {
    variants: {
      variant: {},
    },
  }
);

type Props = React.ComponentProps<'input'> & VariantProps<typeof variants>;

export const Input = forwardRef<HTMLInputElement, Props>(({ variant, className, ...props }, ref) => {
  return <input ref={ref} className={cn(variants({ variant }), className)} {...props} />;
});

Input.displayName = 'Input';
