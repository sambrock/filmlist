import { cn } from '@/lib/utils/app.utils';

type Props = React.ComponentProps<'div'> & {};

export const ChatMessagesList = ({ className, ...props }: Props) => {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {props.children}
    </div>
  );
};
