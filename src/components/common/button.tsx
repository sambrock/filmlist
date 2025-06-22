import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const variants = cva(
  'focus:ring-ring flex items-center font-medium transition focus:ring-2 focus:outline-none',
  {
    variants: {
      variant: {
        default: 'bg-surface-2 hover:bg-surface-3 text-text-primary',
        transparent: 'text-text-2 hover:bg-surface-3 bg-transparent',
        ghost: 'text-text-2 bg-surface-2 hover:bg-surface-3',
        primary: 'text-primary-white border border-white/10 bg-white/10 hover:bg-white/20',
      },
      size: {
        default: 'h-9 rounded-md px-3 py-2 text-sm',
        sm: 'h-8 gap-1.5 rounded-md px-2',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9 justify-center rounded-full',
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

export const Button = ({ asChild, variant, size, className, ...props }: Props) => {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp className={variants({ variant, size, className, disabled: props.disabled })} {...props}>
      {props.children}
    </Comp>
  );
};
