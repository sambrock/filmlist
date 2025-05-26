import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'input'>;

export const ListMovieSearchInput = ({ className, ...props }: Props) => {
  return (
    <input
      className={cn(
        'placeholder:text-text-primary/50 h-input-md absolute text-sm focus:outline-none',
        className
      )}
      placeholder="Add film"
      {...props}
    />
  );
};
