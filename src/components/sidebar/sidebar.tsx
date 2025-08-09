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
    <div className={cn('bg-background-0 border-foreground-0/10 border-r p-4', className)} {...props}>
      <div>
        <div>
          <img className="w-6" src="/logo.svg" alt="Logo" />
        </div>
      </div>
    </div>
  );
};
