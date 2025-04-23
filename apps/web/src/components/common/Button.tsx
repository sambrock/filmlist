import { forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'flex items-center font-sans gap-2 justify-center font-medium text-center cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-bg-secondary text-text-secondary text-sm leading-4 hover:bg-bg-hover hover:text-text-default/80',
        primary: 'bg-white text-black',
      },
      size: {
        default: 'h-input-md px-4 rounded-md',
        icon: 'h-input-md aspect-square rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <button ref={ref} className={buttonVariants({ variant, size, className })} {...props}>
        {props.children}
      </button>
    );
  }
);
