import { cn } from '@/lib/utils/cn';

export const MovieSearchResults = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div className={cn('absolute mt-2 w-lg rounded-lg bg-neutral-900 p-1 drop-shadow-xl', className)} {...props}>
      {props.children}
    </div>
  );
};
