import { Button } from '@/components/common/button';
import { NavThreadsList } from './nav-threads/nav-threads-list';

export const NavView = async () => {
  return (
    <div className="bg-surface-0 border-border-0 flex h-screen flex-col border-r-2">
      <div className="p-4">
        <div className="w-6">
          <img src="/logo.svg" alt="logo" />
        </div>
      </div>

      <div className="flex flex-col px-4 pb-4">
        <Button variant="solid">New chat</Button>
      </div>

      <div className="flex h-full flex-col gap-4 overflow-y-auto px-4">
        <NavThreadsList />
      </div>

      <div className=""></div>
    </div>
  );
};
