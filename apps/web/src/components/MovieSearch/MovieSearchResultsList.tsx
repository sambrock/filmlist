import { cn } from '../../lib/utils';

type MovieSearchResultsListProps = React.ComponentProps<'div'> & {};

export const MovieSearchResultsList = ({ className, ...props }: MovieSearchResultsListProps) => {
  return <div className={cn('p-2 flex flex-col', className)}>{props.children}</div>;
};
