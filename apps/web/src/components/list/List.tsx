import { useQuery } from '@tanstack/react-query';

import { trpc } from '../../lib/trpc';

type ListProps = {
  listId: number;
};

export const List = ({ listId }: ListProps) => {
  const listMoviesQuery = useQuery({
    queryKey: ['list'],
    queryFn: () => trpc.list.find.query({ listId }),
  });

  return (
    <div>
      {/* <button onClick={() => trpc.initializeList.mutate()}>Initialize list</button> */}
      {listMoviesQuery.data?.map((m) => m.movieId)}
    </div>
  );
};
