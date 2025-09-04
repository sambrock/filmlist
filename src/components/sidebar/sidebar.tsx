import Image from 'next/image';
import Link from 'next/link';
import { ListVideo, SquarePen } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SidebarButton } from './sidebar-button';
import { SidebarChats } from './sidebar-chats';

type Props = React.ComponentProps<'div'>;

export const Sidebar = async ({ className, ...props }: Props) => {
  return (
    <div className={cn('border-foreground-0/10 bg-background-0 h-screen border-r p-2', className)} {...props}>
      <div className="p-3">
        <Link href="/">
          <Image className="w-7" src="/logo.svg" alt="Logo" width={28} height={42} />
        </Link>
      </div>

      <div className="mt-4 flex flex-col">
        <SidebarButton asChild>
          <Link href="/" className="">
            <SquarePen className="mr-2 size-5" />
            New chat
          </Link>
        </SidebarButton>
        <SidebarButton asChild>
          <Link href="/" className="">
            <ListVideo className="mr-2 size-5" />
            Library
          </Link>
        </SidebarButton>
      </div>

      <div className="mt-4">
        <div className="text-foreground-1 px-3 py-1 text-sm">Chats</div>
        <SidebarChats />
      </div>
    </div>
  );
};
