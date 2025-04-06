import { cn } from '@/lib/utils/cn';
import { SideNavHeader } from './SideNavHeader';
import { SideNavListItemLiked, SideNavListItemSeen, SideNavListItemWatchlist } from './SideNavListItem';

export const SideNav = ({ className, ...props }: React.ComponentProps<'aside'>) => {
  return (
    <aside className={cn('bg-bg-subtle h-full rounded-lg p-2', className)} {...props}>
      <SideNavHeader />

      <nav className="my-2">
        <ul>
          <SideNavListItemSeen />
          <SideNavListItemLiked />
          <SideNavListItemWatchlist />
        </ul>
      </nav>
    </aside>
  );
};
