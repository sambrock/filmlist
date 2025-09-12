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
        'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:fade-in data-[state=closed]:zoom-in-100 zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-2 data-[state=closed]:fade-out data-[state=closed]:zoom-out-95',
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
