import { forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const inputVariants = cva('focus:outline-none', {
  variants: {
    variant: {
      default: 'h-input-md text-base px-4 bg-bg-secondary rounded-md',
      base: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type InputProps = React.ComponentProps<'input'> & VariantProps<typeof inputVariants>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return <input ref={ref} type="text" className={inputVariants({ className })} {...props} />;
});
