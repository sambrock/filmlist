import { z } from 'zod';

export type Movie = z.infer<typeof MovieSchema>;

export const MovieSchema = z.object({
  movieId: z.number(),
  title: z.string(),
  releaseDate: z.string(),
  posterPath: z.string(),
})