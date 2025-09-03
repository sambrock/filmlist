import Link from 'next/link';
import { SquarePen } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { SidebarButton } from './sidebar-button';
// import { SidebarChats } from './sidebar-chats';

type Props = React.ComponentProps<'div'>;

export const Sidebar = async ({ className, ...props }: Props) => {
  return (
    <div className={cn('border-foreground-0/10 h-screen border-r p-2', className)} {...props}>
      <div className="p-2">
        <Link href="/">
          <img className="w-7" src="/logo.svg" alt="Logo" />
        </Link>
      </div>

      <div className="mt-8 flex flex-col">
        <SidebarButton asChild>
          <Link href="/">
            <SquarePen />
            New chat
          </Link>
        </SidebarButton>
      </div>

      {/* <SidebarChats /> */}
    </div>
  );
};
