import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils/cn';

type Props = React.ComponentProps<'button'> & { asChild?: boolean };

export const SidebarButton = ({ asChild, className, ...props }: Props) => {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      className={cn(
        'hover:bg-foreground-0/5 flex h-10 cursor-pointer font-medium items-center rounded-md px-6 text-sm',
        className
      )}
      {...props}
    >
      {props.children}
    </Comp>
  );
};
