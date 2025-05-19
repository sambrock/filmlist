import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'div'>;

export const MovieSearchResults = forwardRef<HTMLDivElement, Props>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('flex flex-col p-2', className)} {...props}>
      {props.children}
    </div>
  );
});

MovieSearchResults.displayName = 'MovieSearchResults';
