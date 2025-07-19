import { type operations } from './schema-v3';

export type TMDbSearchResult = operations['search-movie']['responses']['200']['content']['application/json'];
export type TMDbMovie = operations['movie-details']['responses']['200']['content']['application/json'];
export type TMDbCredits = operations['movie-credits']['responses']['200']['content']['application/json'];
export type TMDbMovieWithDirector = TMDbMovie & {
  director: string;
};
