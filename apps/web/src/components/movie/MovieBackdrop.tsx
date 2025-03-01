import { cn } from '@/lib/utils/cn';
import { backdropSrc } from '@/lib/utils/imageSrc';

type MovieBackdropImageProps = React.ComponentProps<'img'> & {
  backdropPath: string;
};

export const MovieBackdropImage = ({ className, backdropPath, ...props }: MovieBackdropImageProps) => {
  return (
    <img
      className={cn('', className)}
      src={backdropSrc(backdropPath, 'tmdb', 'original')}
      {...props}
    />
  );
};
