import { cn } from '@/lib/utils/cn';

type Props = React.ComponentProps<'input'>;

export const ChatInputControl = ({ className, ...props }: Props) => {
  return <input type="text" className={cn(className, 'w-full')} {...props} />;
};
