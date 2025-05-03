import { cx } from 'class-variance-authority';
import type { ClassValue } from 'class-variance-authority/types';

import { TMDB_IMAGE_URL } from './constants';

export const cn = (...inputs: ClassValue[]) => {
  return cx(inputs);
};

export const srcTmdbImagePoster = (
  posterPath: string,
  size: 'w92' | 'w185' | 'w342' | 'w500' | 'original'
) => {
  return `${TMDB_IMAGE_URL}${size}${posterPath}`;
};

export const srcTmdbImageBackdrop = (backdropPath: string, size: 'w780' | 'w1200' | 'original') => {
  return `${TMDB_IMAGE_URL}${size}${backdropPath}`;
};
