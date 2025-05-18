'use client';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'input'> & {};

export const ListMovieSearchInput = forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn('w-full px-4 py-3 text-base placeholder:text-neutral-500 focus:outline-none', className)}
      {...props}
    />
  );
});

ListMovieSearchInput.displayName = 'ListMovieSearchInput';
