import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const variants = cva(
  'focus:ring-ring flex items-center font-medium transition focus:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        default: 'bg-surface-2 hover:bg-surface-3 text-text-primary',
        transparent: 'text-text-2 hover:bg-surface-3 bg-transparent',
        ghost: 'text-text-2 bg-surface-2 hover:bg-surface-3',
        primary: 'text-primary-foreground bg-primary border-primary-foreground/20 border',
      },
      size: {
        default: 'h-9 rounded-md px-3 py-2 text-sm',
        sm: 'h-8 gap-1.5 rounded-md px-2',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9 justify-center rounded-md',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      disabled: false,
    },
  }
);

type Props = React.ComponentProps<'button'> & VariantProps<typeof variants> & { asChild?: boolean };

export const Button = ({ asChild, variant, size, className, disabled, ...props }: Props) => {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp className={variants({ className, variant, size, disabled })} {...props}>
      {props.children}
    </Comp>
  );
};
