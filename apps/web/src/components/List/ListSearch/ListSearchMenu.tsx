import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'div'> & {
  isLoading: boolean;
};

export const ListMovieSearchMenu = ({ isLoading, ...props }: Props) => {
  return (
    <div className="flex w-full flex-col">
      <div className={cn('h-[1px]', isLoading ? 'gradient-border-animate' : 'bg-border-1')}></div>
      <div className="flex max-h-[310px] w-full flex-col gap-1 overflow-y-auto p-2">
        {props.children}
        <div></div>
      </div>
    </div>
  );
};
