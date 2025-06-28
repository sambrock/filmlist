'use client';

import { DropdownMenu } from 'radix-ui';

import { cn } from '@/lib/utils/cn.util';

export const DropdownRoot = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;
export const DropdownPortal = DropdownMenu.Portal;

export const DropdownContent = ({ className, ...props }: DropdownMenu.DropdownMenuContentProps) => {
  return (
    <DropdownMenu.Content
      className={cn(
        'bg-background-0 min-w-52 rounded-md p-1',
        'data-[state=open]:motion-scale-in-[.9] data-[state=open]:motion-duration-150 data-[state=open]:motion-opacity-in-100',
        'data-[state=closed]:motion-scale-out-[.9] data-[state=closed]:motion-duration-150 data-[state=closed]:motion-opacity-out-0',
        className
      )}
      {...props}
    >
      {props.children}
    </DropdownMenu.Content>
  );
};

export const DropdownItem = ({ className, ...props }: DropdownMenu.DropdownMenuItemProps) => {
  return (
    <DropdownMenu.Item
      className={cn('focus:bg-background-2 rounded-md px-3 py-2 text-sm focus:outline-none', className)}
      {...props}
    >
      {props.children}
    </DropdownMenu.Item>
  );
};
