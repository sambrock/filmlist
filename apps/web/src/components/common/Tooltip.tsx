import { Tooltip } from 'radix-ui';

import { cn } from '../../lib/utils';

export const TooltipProvider = Tooltip.Provider;

export const TooltipRoot = Tooltip.Root;

export const TooltipTrigger = Tooltip.Trigger;

export const TooltipPortal = Tooltip.Portal;

export const TooltipContent = ({ className, ...props }: Tooltip.TooltipContentProps) => {
  return (
    <Tooltip.Content {...props} asChild>
      <div
        className={cn(
          'mt-1 flex h-5 items-center rounded-sm bg-neutral-800 px-2 text-xs font-medium text-neutral-200 shadow',
          className
        )}
      >
        {props.children}
      </div>
    </Tooltip.Content>
  );
};
