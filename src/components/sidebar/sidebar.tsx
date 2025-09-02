import Link from 'next/link';

import { getAuthTokenCookie, verifyAuthToken } from '@/lib/auth';
import { HydrateClient } from '@/lib/trpc/server';
import { cn } from '@/lib/utils/cn';
import { SidebarChatList } from './sidebar-chat-list';

type Props = React.ComponentProps<'div'>;

export const Sidebar = async ({ className, ...props }: Props) => {
  const authToken = await getAuthTokenCookie();
  if (authToken) {
    const user = verifyAuthToken(authToken);

    if (user) {
      // void trpc.getChats.prefetch({ userId: clearUuid(user.userId) });
    }
  }

  return (
    <HydrateClient>
      <div className={cn('border-foreground-0/10 h-screen border-r p-2', className)} {...props}>
        <div className="p-2">
          <Link href="/">
            <img className="w-7" src="/logo.svg" alt="Logo" />
          </Link>
        </div>

        <div className="mt-2 h-full w-full rounded-xl">
          <SidebarChatList />
        </div>
      </div>
    </HydrateClient>
  );
};
