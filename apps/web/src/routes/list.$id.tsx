import { createFileRoute } from '@tanstack/react-router';

import { List } from '../components/list/List';
import { MovieSearch } from '../components/search/MovieSearch';
import { trpc } from '../lib/trpc';
import { useListStore } from '../stores/useListStore';

const { dispatch } = useListStore.getState().actions;

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
  return (
    <div className="grid grid-cols-[1fr_6fr] gap-4">
      <MovieSearch />
      <List />
    </div>
  );
}
