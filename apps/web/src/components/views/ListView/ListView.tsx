import { ListViewMovies } from './ListViewMovies';
import { ListViewSearch } from './ListViewSearch';

export const ListView = () => {
  return (
    <div className=" my-8">
      <ListViewMovies />
      <ListViewSearch />
    </div>
  );
};
