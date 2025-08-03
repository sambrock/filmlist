import { cn } from '@/lib/utils';
import { UserContextProvider } from '@/providers/user-context-provider';
import { SidebarThreadLinks } from './sidebar-thread-links';

type Props = React.ComponentProps<'div'>;

export const Sidebar = ({ className, ...props }: Props) => {
  return (
    <div className={cn('bg-background-0 border-foreground-0/10 border-r p-4', className)} {...props}>
      <div>
        <div>
          <img className="w-6" src="/logo.svg" alt="Logo" />
        </div>
      </div>

      <div>
        <UserContextProvider>
          <SidebarThreadLinks />
        </UserContextProvider>
      </div>
    </div>
  );
};
