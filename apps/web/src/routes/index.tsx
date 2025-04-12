import { createFileRoute } from '@tanstack/react-router';

import { List } from '../components/list/List';
import { MovieSearch } from '../components/search/MovieSearch';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="p-8">
      <MovieSearch />
    </div>
  );
}
