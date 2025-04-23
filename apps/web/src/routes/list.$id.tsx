import { createFileRoute } from '@tanstack/react-router';

import { ListView } from '../components/views/list-view/ListView';
import { trpc } from '../lib/api/trpc';
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
  return <ListView />;
}
