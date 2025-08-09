export const posterSrc = (
  posterPath: string,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'
) => {
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

export const backdropSrc = (backdropPath: string, size: 'w300' | 'w780' | 'w1280' | 'original') => {
  return `https://image.tmdb.org/t/p/${size}${backdropPath}`;
};

export const runtimeToHoursMins = (runtimeMins: number) => {
  const hours = Math.floor(runtimeMins / 60);
  const minutes = runtimeMins % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
};
