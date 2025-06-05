import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const variants = cva('cursor-pointer rounded-md font-medium', {
  variants: {
    variant: {
      solid: 'bg-surface-1 hover:bg-primary/90 text-text-primary',
      transparent: 'hover:bg-surface-1 text-text-primary bg-transparent',
    },
    size: {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    },
  },
  defaultVariants: {
    variant: 'transparent',
    size: 'md',
  },
});

type Props = React.ComponentProps<'button'> & VariantProps<typeof variants> & { asChild?: boolean };

export const Button = ({ asChild, variant, className, ...props }: Props) => {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp className={variants({ variant, className })} {...props}>
      {props.children}
    </Comp>
  );
};
