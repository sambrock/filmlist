import { cn } from '../../lib/utils';
import { IconPlus } from '../common/Icon';

type MovieSearchInputWrapperProps = React.ComponentProps<'div'> & {
  open: boolean;
  input: React.ReactNode;
};

export const MovieSearchInputWrapper = ({
  input,
  open,
  className,
  ...props
}: MovieSearchInputWrapperProps) => {
  return (
    <div className={cn(open && 'border-t border-neutral-800', className)} {...props}>
      <div className="flex w-full items-center px-2 py-2">
        <IconPlus className="mr-1 ml-2 stroke-neutral-600" />
        {input}
      </div>
    </div>
  );
};
