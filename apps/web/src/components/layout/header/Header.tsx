import { cn } from '@/lib/utils/cn';
import { MovieSearch } from '@/components/movie-search/MovieSearch';
import { HeaderLogo } from './HeaderLogo';

export const Header = ({ className, ...props }: React.ComponentProps<'header'>) => {
  return (
    <header className={cn('bg-background sticky top-0 z-10 flex w-full items-center', className)} {...props}>
      <HeaderLogo />
      <div className="relative ml-6 w-full max-w-md">
        <MovieSearch />
      </div>
    </header>
  );
};
