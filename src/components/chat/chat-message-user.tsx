import { Message } from '@/lib/drizzle/zod';
import { cn } from '@/lib/utils/cn.util';

type Props = React.ComponentProps<'div'> & {
  message: Message;
};

export const ChatMessageUser = ({ message, className, ...props }: Props) => {
  return (
    <div className={cn('bg-surface-2 ml-auto rounded-xl px-4 py-2', className)} {...props}>
      {message.content}
    </div>
  );
};
