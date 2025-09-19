import { type operations } from './schema-v3';

export type SearchMovie = operations['search-movie']['responses']['200']['content']['application/json'];
export type MovieDetails = operations['movie-details']['responses']['200']['content']['application/json'];
export type MovieCredits = operations['movie-credits']['responses']['200']['content']['application/json'];

export type MovieDetailsWithCredits = MovieDetails & { credits: MovieCredits };
