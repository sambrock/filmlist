import { z } from 'zod';

export type Movie = z.infer<typeof getMovieOutput>;
export type SearchMovieResult = z.infer<typeof searchMoviesOutput>;

export type GetMovieInput = z.infer<typeof getMovieInput>;
export type GetMovieOutput = z.infer<typeof getMovieOutput>;

export type GetMovieCastInput = z.infer<typeof getMovieCastInput>;

export type GetMovieWatchProvidersInput = z.infer<typeof getMovieWatchProvidersInput>;
export type GetMovieWatchProvidersOutput = z.infer<typeof getMovieWatchProvidersOutput>;

export type SearchMoviesInput = z.infer<typeof searchMoviesInput>;
export type SearchMoviesOutput = z.infer<typeof searchMoviesOutput>;

export type GetPopularMoviesOutput = z.infer<typeof getPopularMoviesOutput>

export const getMovieInput = z.object({
  movieId: z.number(),
});
export const getMovieOutput = z.object({
  movieId: z.number(),
  title: z.string(),
  releaseDate: z.string(),
  posterPath: z.string(),
  backdropPath: z.string(),
  overview: z.string(),
  runtime: z.number(),
  tagline: z.string(),
  voteAverage: z.number().optional(),
  voteCount: z.number().optional(),
  directors: z.string().array(),
  genres: z.array(z.string()).optional(),
});

export const getMovieCastInput = z.object({
  movieId: z.number(),
});

export const getMovieWatchProvidersInput = z.object({
  movieId: z.number(),
});
export const getMovieWatchProvidersOutput = z.object({
  providerId: z.number(),
  providerName: z.string(),
  logoPath: z.string(),
  options: z.enum(['buy', 'rent', 'stream']).array(),
});

export const searchMoviesInput = z.object({
  query: z.string(),
  year: z
    .string()
    .length(4)
    .regex(/^\d{4}$/)
    .optional(),
});
export const searchMoviesOutput = z.object({
  movieId: z.number(),
  title: z.string(),
  releaseDate: z.string(),
  posterPath: z.string(),
  directors: z.string().array(),
});

export const getPopularMoviesOutput = z.object({
  movieId: z.number(),
  title: z.string(),
  releaseDate: z.string(),
  posterPath: z.string(),
});
