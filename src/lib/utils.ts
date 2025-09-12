import { cx, CxOptions } from 'class-variance-authority';
import { v4 } from 'uuid';

import type { Doc } from '@/infra/convex/_generated/dataModel';

export const cn = (...inputs: CxOptions) => {
  return cx(inputs);
};

export const generateUuid = () => {
  return v4();
};

export const timeAgo = (date: Date) => {
  const now = new Date();
  const secondsPast = (now.getTime() - date.getTime()) / 1000;

  if (secondsPast < 60) {
    return 'just now';
  } else if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (secondsPast <= 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (secondsPast <= 2592000) {
    // Approximately 30 days in a month
    const days = Math.floor(secondsPast / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (secondsPast <= 31536000) {
    // Approximately 365 days in a year
    const months = Math.floor(secondsPast / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(secondsPast / 31536000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
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

export const runtimeToHoursMins = (runtimeMins: number) => {
  const hours = Math.floor(runtimeMins / 60);
  const minutes = runtimeMins % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
};

export const genreName = (name: string) => {
  if (name === 'Science Fiction') {
    return 'Sci-Fi';
  }
  return name;
};

/**
 * @description Parses the arbitrary AI model response text into a structured format
 * @param content - The content returned from the AI model
 * @returns An array of movie objects with title, release year, and why
 */
export const modelResponseTextToMoviesArr = (content: string) => {
  const titleRegex = /"title":\s*"([^"]+)"?/g;
  const releaseYearRegex = /"release_year":\s*"?(\d{4})?/g;
  const whyRegex = /"why":\s*"([^"]+)"?/g;

  const titles = [...content.matchAll(titleRegex)].map((m) => m[1]?.trim());
  const releaseYears = [...content.matchAll(releaseYearRegex)].map((m) => m[1]?.trim());
  const whys = [...content.matchAll(whyRegex)].map((m) => m[1]?.trim());

  const length = Math.max(titles.length, releaseYears.length, whys.length);

  const movies: NonNullable<Doc<'messages'>['movies']> = [];

  for (let i = 0; i < length; i++) {
    movies.push({
      found: false,
      title: titles[i] || '',
      releaseDate: releaseYears[i] ? new Date(+releaseYears[i], 0, 1).getTime() : 0,
      why: whys[i] || '',
    });
  }

  return movies;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
