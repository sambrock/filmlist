import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/common/Icon';
import { Input } from '@/components/common/Input';

export const MovieSearchInput = ({ className, ...props }: React.ComponentProps<'input'>) => {
  return (
    <div className="relative w-full">
      <Icon
        name="search"
        className="size-icon absolute top-1/2 left-2.5 -translate-y-1/2 stroke-neutral-500"
      />
      <Input
        className={cn('!h-10 w-full !rounded-full bg-neutral-900 pl-11 !text-base', className)}
        placeholder="Search films"
        {...props}
      />
    </div>
  );
};
