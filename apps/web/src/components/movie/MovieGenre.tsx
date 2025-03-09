import { type Movie } from '@filmlist/api/app.types';
import { cn } from '@/lib/utils/cn';

type MovieGenresProps = React.ComponentProps<'div'> & {
  genre: Movie['genres'][number];
};

const OVERRIDES: Record<string, string> = {
  'Science Fiction': 'Sci-Fi',
};

export const MovieGenre = ({ genre, className, ...props }: MovieGenresProps) => {
  return (
    <div
      className={cn(
        'text-text-subtle inline-flex h-6 items-center justify-center rounded-sm bg-white/5 px-2 py-1 text-sm leading-0 font-medium'
      )}
      {...props}
    >
      {OVERRIDES[genre] || genre}
    </div>
  );
};
