import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'div'>;

export const MovieGrid = ({ className, ...props }: Props) => {
  return (
    <div className={cn('grid grid-cols-6 gap-1', className)} {...props}>
      {props.children}
    </div>
  );
};
