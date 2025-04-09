import z from 'zod';

import { Context } from '../lib/trpc';

export const addMovieToListInputSchema = z.object({
  listId: z.number(),
  movieId: z.number(),
});

export const addMovieToListHandler = async (
  input: z.infer<typeof addMovieToListInputSchema>,
  ctx: Context
) => {
  const { listId, movieId } = input;
  const { db } = ctx;

  return;
};
