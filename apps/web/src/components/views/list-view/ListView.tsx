import { MoviesSearch } from '../../MovieSearch/MovieSearch';
import { ListViewHeader } from './ListViewHeader';
import { ListViewMovies } from './ListViewMovies';
import { ListViewToolbar } from './ListViewToolbar';

export const ListView = () => {
  return (
    <div className="reference m-2 mx-auto flex h-[calc(100vh-16px)] w-[1100px] flex-col gap-4 rounded-lg bg-transparent">
      <ListViewToolbar />
      <ListViewHeader />
      <ListViewMovies />
      <div className="absolute bottom-8 left-1/2 z-10 w-[520px] -translate-x-1/2">
        <MoviesSearch />
      </div>
    </div>
  );
};
