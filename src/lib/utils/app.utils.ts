import { cx, type CxOptions } from 'class-variance-authority';

export const cn = (...inputs: CxOptions) => {
  return cx(inputs);
};

export const scrollToEnd = () => {
  const end = document.getElementById('chat-end');
  if (end) {
    end.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'end' });
  }
};

export const posterSrc = (
  posterPath: string,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'
) => {
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

export const backdropSrc = (backdropPath: string, size: 'w300' | 'w780' | 'w1280' | 'original') => {
  return `https://image.tmdb.org/t/p/${size}${backdropPath}`;
};
