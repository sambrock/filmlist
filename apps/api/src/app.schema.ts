import { z } from 'zod';

export type Movie = z.infer<typeof MovieSchema>;
export type List = z.infer<typeof ListSchema>;
export type ListMovie = z.infer<typeof ListMovieSchema>;

export const MovieSchema = z.object({
  sourceId: z.number(),
  title: z.string(),
  overview: z.string(),
  releaseDate: z.string(),
  posterPath: z.string(),
  backdropPath: z.string(),
});

export const ListSchema = z.object({
  publicId: z.string(),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ListMovieSchema = z.object({
  movieId: z.number(),
  title: z.string(),
  releaseDate: z.string(),
  posterPath: z.string(),
  order: z.number(),
});
