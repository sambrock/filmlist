import { useShallow } from 'zustand/shallow';

import { useListStore } from '../../../stores/useListStore';

export const ListViewMovies = () => {
  const movies = useListStore(useShallow((s) => [...s.movies.values()]));

  return (
    <div className="grid grid-cols-8 gap-1 px-8 py-4">
      {[...movies.values()].map(({ movie }, index) => (
        <div key={index} className="overflow-clip rounded-sm">
          <img src={`https://image.tmdb.org/t/p/w342/${movie.posterPath}`} />
        </div>
      ))}
    </div>
  );
};
