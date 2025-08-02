import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'div'>;

export const Sidebar = ({ className, ...props }: Props) => {
  return (
    <div className={cn('bg-background-0 border-foreground-0/10 border-r p-4', className)} {...props}>
      <div>
        <div>
          <img className="w-6" src="/logo.svg" alt="Logo" />
        </div>
      </div>
    </div>
  );
};
