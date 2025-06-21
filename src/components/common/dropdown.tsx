'use client';

import { DropdownMenu } from 'radix-ui';

import { cn } from '@/lib/utils/cn';

export const DropdownRoot = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;
export const DropdownPortal = DropdownMenu.Portal;

export const DropdownContent = ({ className, ...props }: DropdownMenu.DropdownMenuContentProps) => {
  return (
    <DropdownMenu.Content className={cn('bg-surface-0 min-w-52 rounded-md p-1', className)} {...props}>
      {props.children}
    </DropdownMenu.Content>
  );
};

export const DropdownItem = ({ className, ...props }: DropdownMenu.DropdownMenuItemProps) => {
  return (
    <DropdownMenu.Item
      className={cn('focus:bg-surface-1 rounded-md px-3 py-2 text-sm focus:outline-none', className)}
      {...props}
    >
      {props.children}
    </DropdownMenu.Item>
  );
};
