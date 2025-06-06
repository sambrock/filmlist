import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const variants = cva('flex cursor-pointer items-center font-medium', {
  variants: {
    variant: {
      default: 'bg-surface-2 hover:bg-surface-3 text-text-primary',
      transparent: 'hover:bg-surface-2 text-text-primary bg-transparent',
    },
    size: {
      default: 'h-9 rounded-md px-4 py-2',
      sm: 'h-8 gap-1.5 rounded-md px-3',
      lg: 'h-10 rounded-md px-6',
      icon: 'size-9 justify-center rounded-md',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type Props = React.ComponentProps<'button'> & VariantProps<typeof variants> & { asChild?: boolean };

export const Button = ({ asChild, variant, size, className, ...props }: Props) => {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp className={variants({ variant, size, className })} {...props}>
      {props.children}
    </Comp>
  );
};
