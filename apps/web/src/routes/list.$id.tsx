import { createFileRoute } from '@tanstack/react-router';

import { List } from '../components/list/List';
import { MovieSearch } from '../components/search/MovieSearch';
import { trpc } from '../lib/trpc';
import { dispatch } from '../stores/useGlobalStore/store';

export const Route = createFileRoute('/list/$id')({
  component: ListPage,
  loader: async ({ params }) => {
    const data = await trpc.list.load.query(params.id);
    dispatch({
      type: 'INITIALIZE_LIST',
      payload: {
        list: data.list,
        movies: new Map(data.movies.map((movie) => [movie.movieId, movie])),
      },
    });
  },
});

function ListPage() {
  const { id } = Route.useParams();

  return (
    <div className="grid grid-cols-[1fr_6fr] gap-4">
      <MovieSearch editId={id} />
      <List />
    </div>
  );
}
