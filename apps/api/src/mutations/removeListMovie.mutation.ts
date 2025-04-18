import { and, eq } from 'drizzle-orm';

import { listMovieDeleteSchema, listMovies } from '@repo/drizzle';
import { middlewareDatabase, procedure } from '../lib/trpc';

export const removeListMovie = procedure
  .use(middlewareDatabase)
  .input(listMovieDeleteSchema)
  .mutation(async ({ input, ctx }) => {
    await ctx.db
      .delete(listMovies)
      .where(and(eq(listMovies.listId, input.listId), eq(listMovies.movieId, input.movieId)));
  });
