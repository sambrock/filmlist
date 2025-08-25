import { createContext } from '@/server/trpc';
import { trpc } from '@/lib/trpc/server';
import { cn } from '@/lib/utils/cn';

type Props = React.ComponentProps<'div'>;

export const Sidebar = async ({ className, ...props }: Props) => {
  const ctx = await createContext();

  if (ctx.user) {
    void trpc.getUserThreads.prefetch({ userId: ctx.user.userId });
  }

  return (
    <div className={cn('border-foreground-0/10 h-screen border-r p-2', className)} {...props}>
      <div className="p-2">
        <img className="w-7" src="/logo.svg" alt="Logo" />
      </div>
      <div className="mt-2 h-full w-full rounded-xl"></div>
    </div>
  );
};
