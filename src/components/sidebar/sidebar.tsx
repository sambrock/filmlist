import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'div'>;

export const Sidebar = ({ className, ...props }: Props) => {
  return <div className={cn('bg-background-0 debug w-96 p-3', className)} {...props}></div>;
};
