import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const buttonVariants = cva('inline-flex items-center justify-center cursor-pointer', {
  variants: {
    variant: {
      default: 'bg-text text-foreground font-medium',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium',
      ghost: 'bg-foreground hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline font-medium',
      outline: 'border border-white/10 text-white/50 hover:bg-text/10 font-medium',
      custom: '',
    },
    radius: {
      default: 'rounded-md',
      circle: 'rounded-full',
    },
    size: {
      default: 'h-input-md px-3 text-sm',
      xs: 'h-input-xs px-2 text-xs',
      sm: 'h-input-sm px-3 text-sm',
      lg: 'h-input-lg px-8',
      icon: 'h-10 w-10',
      custom: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    radius: 'default',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, radius, className }))} ref={ref} {...props} />;
  }
);
