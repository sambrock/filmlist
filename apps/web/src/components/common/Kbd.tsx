import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'div'>;

export const Kbd = ({ className, ...props }: Props) => {
  return (
    <div
      className={cn(
        'bg-surface-2 text-text-primary/50 flex h-5 items-center rounded-sm px-1 text-xs leading-none shadow-sm select-none',
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
};
