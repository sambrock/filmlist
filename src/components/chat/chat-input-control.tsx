import { cn } from '@/lib/utils/cn';

type Props = React.ComponentProps<'textarea'>;

export const ChatInputControl = ({ className, ...props }: Props) => {
  return <textarea rows={1} className={cn(className, 'w-full resize-none')} {...props}></textarea>;
};
