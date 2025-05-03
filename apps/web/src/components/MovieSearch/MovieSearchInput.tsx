import { useRef } from 'react';

import { cn } from '../../lib/utils';
import { Dispatch } from './MovieSearch';

type MovieSearchInputProps = React.ComponentProps<'input'> & {
  dispatch: Dispatch;
};

export const MovieSearchInput = ({ dispatch, className, ...props }: MovieSearchInputProps) => {
  const timeoutRef = useRef<number>(null);

  return (
    <input
      className={cn(
        'w-full px-2 text-sm font-medium placeholder:text-neutral-600 focus:outline-none',
        className
      )}
      placeholder="Add film"
      onFocus={() => dispatch({ type: 'OPEN' })}
      onBlur={() => dispatch({ type: 'CLOSE' })}
      onChange={(e) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'SET_QUERY', payload: { query: e.target.value } });
        }, 500);
      }}
      {...props}
    />
  );
};
