import { type Movie } from '@filmlist/api';
import { cn } from '@/lib/utils/cn';

type MovieGenresProps = React.ComponentProps<'div'> & {
  genre: string;
};

const OVERRIDES: Record<string, string> = {
  'Science Fiction': 'Sci-Fi',
};

export const MovieGenre = ({ genre, className, ...props }: MovieGenresProps) => {
  return (
    <div
      className={cn(
        'text-neutral-400 inline-flex h-6 items-center justify-center rounded-sm bg-neutral-900 px-2 py-1 text-sm leading-0 font-medium'
      )}
      {...props}
    >
      {OVERRIDES[genre] || genre}
    </div>
  );
};
