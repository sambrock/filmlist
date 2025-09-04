import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'button'> & { asChild?: boolean };

export const SidebarButton = ({ asChild, className, ...props }: Props) => {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      className={cn(
        'hover:bg-foreground-0/5 text-foreground-2 hover:text-foreground-0 flex h-9 cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap',
        className
      )}
      {...props}
    >
      {props.children}
    </Comp>
  );
};
