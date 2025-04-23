import { ListViewHeader } from './ListViewHeader';
import { ListViewMovies } from './ListViewMovies';
import { ListViewSearch } from './ListViewSearch';
import { ListViewToolbar } from './ListViewToolbar';

export const ListView = () => {
  return (
    <div className="reference m-2 mx-auto flex h-[calc(100vh-16px)] w-[1100px] flex-col gap-4 rounded-lg border border-neutral-800/50 bg-transparent">
      <ListViewToolbar />
      <ListViewHeader />
      <ListViewMovies />
      <ListViewSearch />
    </div>
  );
};
