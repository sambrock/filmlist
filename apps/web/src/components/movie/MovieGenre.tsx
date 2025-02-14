import { type Movie } from '@filmlist/api/app.schemas';

import { cn } from '@/lib/utils/cn';
import { type MoviePosterColors } from '@/lib/utils/imageColor';

type MovieGenresProps = React.ComponentProps<'div'> & {
  genre: Movie['genres'][number];
  colors: MoviePosterColors;
};

const OVERRIDES: Record<string, string> = {
  'Science Fiction': 'Sci-Fi',
};

export const MovieGenre = ({ genre, colors, className, ...props }: MovieGenresProps) => {
  return (
    <div
      className={cn(
        'text-text/70 bg-text/5 inline-flex h-6 items-center justify-center rounded-sm px-2 py-1 text-sm leading-0 font-medium'
      )}
      {...props}
    >
      {OVERRIDES[genre] || genre}
    </div>
  );
};
