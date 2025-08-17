import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const variants = cva(
  'focus:ring-ring flex items-center font-medium whitespace-nowrap transition focus:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        default: 'bg-surface-2 hover:bg-surface-3 text-text-primary',
        transparent: 'text-text-2 hover:bg-surface-3 bg-transparent',
        ghost: 'text-foreground-1 hover:text-foreground-0 hover:bg-foreground-1/20',
        primary: 'text-primary-foreground bg-primary border-primary-foreground/20 border',
      },
      size: {
        default: 'h-9 px-3 py-2 text-sm',
        sm: 'h-8 gap-1.5 px-2',
        lg: 'h-10 px-6',
        icon: 'size-9 justify-center rounded-full',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: 'cursor-pointer',
      },
      pill: {
        true: 'rounded-full',
        false: 'rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      disabled: false,
      pill: false,
    },
  }
);

type Props = React.ComponentProps<'button'> & VariantProps<typeof variants> & { asChild?: boolean };

export const Button = ({ asChild, variant, size, pill, className, disabled, ...props }: Props) => {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp className={variants({ className, variant, size, disabled, pill })} {...props}>
      {props.children}
    </Comp>
  );
};
