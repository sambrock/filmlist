import { cn } from '@/lib/utils';

type RemoteOpts =
  | {
      remote: 'tmdb';
      size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
    }
  | {
      remote: 'filmlist';
      size: 'w500';
    };

type Props = React.ComponentProps<'img'> & { posterPath: string } & RemoteOpts;

export const Poster = ({ posterPath, remote, size, className, ...props }: Props) => {
  return (
    <img
      className={cn('aspect-[1/1.5] bg-neutral-800', className)}
      src={`http://image.tmdb.org/t/p/${size}${posterPath}`}
      {...props}
    />
  );
};
