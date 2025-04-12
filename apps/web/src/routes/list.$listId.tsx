import { createFileRoute } from '@tanstack/react-router';

import { List } from '../components/list/List';
import { MovieSearch } from '../components/search/MovieSearch';

export const Route = createFileRoute('/list/$listId')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();

  return (
    <div>
      <MovieSearch />
      <List listId={+params.listId} />
    </div>
  );
}
