import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'div'>;

export const MovieGrid = ({ className, ...props }: Props) => {
  return (
    <div className={cn('grid grid-cols-6 gap-x-1 gap-y-3', className)} {...props}>
      {props.children}
    </div>
  );
};
