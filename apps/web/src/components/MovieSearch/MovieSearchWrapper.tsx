import { cn } from '../../lib/utils';

type MovieSearchWrapperProps = React.ComponentProps<'div'>;

export const MovieSearchWrapper = ({ className, ...props }: MovieSearchWrapperProps) => {
  return (
    <div
      className={cn(
        'overflow-clip rounded-lg border border-neutral-800 bg-neutral-900/90 backdrop-blur-md',
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
};
