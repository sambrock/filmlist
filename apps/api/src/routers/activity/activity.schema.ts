import { z } from 'zod';

export type GetUserMovieActivityInput = z.infer<typeof getUserMovieActivityInput>;
export type GetUserMovieActivityOutput = z.infer<typeof getUserMovieActivityOutput>;

export type WatchMovieInput = z.infer<typeof watchMovieInput>;

export type LikeMovieInput = z.infer<typeof likeMovieInput>;

export type RateMovieInput = z.infer<typeof rateMovieInput>;

export const getUserMovieActivityInput = z.object({
  movieId: z.number(),
});
export const getUserMovieActivityOutput = z.object({
  watched: z.boolean(),
  liked: z.boolean(),
  rating: z.number(),
  // watchlist
});

export const watchMovieInput = z.object({
  movieId: z.number(),
  watched: z.boolean(),
});

export const likeMovieInput = z.object({
  movieId: z.number(),
  liked: z.boolean(),
});

export const rateMovieInput = z.object({
  movieId: z.number(),
  rating: z.number().max(10),
});
