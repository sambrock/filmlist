import { Message } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

type Props = React.ComponentProps<'div'> & {
  message: Message;
};

export const UserMessage = ({ message, className, ...props }: Props) => {
  return (
    <div className="flex flex-col items-end">
      <div className={cn('bg-surface-2 max-w-2/3 rounded-xl px-3 py-2', className)} {...props}>
        {message.content}
      </div>
    </div>
  );
};
