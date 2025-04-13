import { useListMovies } from '../../stores/useGlobalStore/store';

export const List = () => {
  const movies = useListMovies();

  return (
    <div className="grid grid-cols-6 gap-1">
      {[...movies.values()].map((movie) => (
        <div key={movie.tmdbId} className="overflow-clip rounded-sm">
          <img src={`https://image.tmdb.org/t/p/w342/${movie.posterPath}`} />
        </div>
      ))}
    </div>
  );
};
