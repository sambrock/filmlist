'use client';

import { DropdownMenu } from 'radix-ui';

import { cn } from '@/lib/utils';

export const DropdownRoot = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;
export const DropdownPortal = DropdownMenu.Portal;

export const DropdownContent = ({ className, ...props }: DropdownMenu.DropdownMenuContentProps) => {
  return (
    <DropdownMenu.Content
      className={cn(
        'bg-background-4 border-foreground-0/5 min-w-52 rounded-lg border p-1 shadow-md shadow-black/20',
        'data-[state=open]:motion-scale-in-[.9] data-[state=open]:motion-duration-150 data-[state=open]:motion-opacity-in-100',
        'data-[state=closed]:motion-scale-out-[.9] data-[state=closed]:motion-duration-150 data-[state=closed]:motion-opacity-out-0',
        className
      )}
      onCloseAutoFocus={(e) => {
        e.preventDefault();
      }}
      {...props}
    >
      {props.children}
    </DropdownMenu.Content>
  );
};

export const DropdownItem = ({ className, ...props }: DropdownMenu.DropdownMenuItemProps) => {
  return (
    <DropdownMenu.Item
      className={cn(
        'focus:bg-background-1 cursor-pointer rounded-md px-3 py-2 text-sm focus:outline-none',
        className
      )}
      {...props}
    >
      {props.children}
    </DropdownMenu.Item>
  );
};
