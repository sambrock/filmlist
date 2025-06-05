import { Message } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

type Props = React.ComponentProps<'div'> & {
  message: Message;
};

export const AssistantMessage = ({ message, className, ...props }: Props) => {
  return (
    <div className={cn('', className)} {...props}>
      {message.content}
    </div>
  );
};
