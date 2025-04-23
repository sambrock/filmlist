import { useRef } from 'react';
import { Plus } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Input, InputProps } from '../common/Input';

type MovieSearchInputProps = InputProps & {
  setQuery: (query: string) => void;
};

export const MovieSearchInput = ({ setQuery, className, ...props }: MovieSearchInputProps) => {
  const timeoutRef = useRef<number>(null);

  return (
    <div className="relative">
      <Plus className="stroke-text-secondary absolute top-1/2 left-2 h-6 w-6 -translate-y-1/2" />
      <Input
        className={cn('focus:bg-bg-hover w-[320px] pl-10 text-sm font-semibold', className)}
        placeholder="Add film"
        onChange={(e) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            setQuery(e.target.value);
          }, 500);
        }}
        {...props}
      />
    </div>
  );
};
