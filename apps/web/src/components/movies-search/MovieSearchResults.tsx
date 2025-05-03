import { cn } from '../../lib/utils';

export const MovieSearchResults = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div className={cn('w-[560px] rounded-md bg-neutral-800/50 backdrop-blur-md p-2', className)} {...props}>
      {props.children}
    </div>
  );
};
