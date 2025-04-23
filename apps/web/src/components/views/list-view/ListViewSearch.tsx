import { MovieSearch } from '../../movies-search/MovieSearch';

export const ListViewSearch = () => {
  return (
    <div className="absolute bottom-8 left-1/2 z-10 w-[520px] -translate-x-1/2">
      <MovieSearch />
    </div>
  );
};
