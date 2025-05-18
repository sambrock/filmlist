import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'h1'> & { initialTitle?: string };

export const ListTitleStatic = ({ initialTitle, className, ...props }: Props) => {
  return (
    <h1 className={cn('text-3xl font-black', className)} {...props}>
      {initialTitle}
    </h1>
  );
};
