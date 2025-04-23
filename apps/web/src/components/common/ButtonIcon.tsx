import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonIconVariants = cva(
  [
    'flex size-[1.8rem] cursor-pointer items-center justify-center [&_svg]:size-[1.1rem]',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
  ],
  {
    variants: {
      variant: {
        solid: 'bg-neutral-300 hover:bg-neutral-200 [&_svg]:stroke-neutral-800',
        soft: 'bg-neutral-800 hover:bg-neutral-700 [&_svg]:stroke-neutral-400',
        transparent: 'bg-transparent hover:bg-neutral-800 [&_svg]:stroke-neutral-500',
      },
      tone: {
        neutral: '',
      },
      circle: {
        true: 'rounded-full',
        false: 'rounded-md',
      },
    },
    defaultVariants: {
      variant: 'solid',
      tone: 'neutral',
      circle: false,
    },
  }
);

export type ButtonIconProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonIconVariants> & {
    icon: React.ReactNode;
  };

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  ({ icon, variant, tone, circle, className, ...props }, ref) => {
    return (
      <button ref={ref} className={buttonIconVariants({ variant, tone, circle, className })} {...props}>
        {icon}
      </button>
    );
  }
);
