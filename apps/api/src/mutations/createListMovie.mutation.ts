import z from 'zod';

import { listMovies, movies } from '@filmlist/drizzle';
import { middlewareDatabase, procedure } from '../lib/trpc';

export const createListMovie = procedure
  .use(middlewareDatabase)
  .input(
    z.object({
      listId: z.number(),
      movieId: z.number(),
      title: z.string(),
      overview: z.string(),
      posterPath: z.string(),
      backdropPath: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [{ insertedId }] = await ctx.db
      .insert(movies)
      .values({
        tmdbId: input.movieId,
        title: input.title,
        overview: input.overview,
        posterPath: input.posterPath,
        backdropPath: input.backdropPath,
      })
      .returning({ insertedId: movies.id });

    await ctx.db.insert(listMovies).values({
      listId: input.listId,
      movieId: insertedId,
      order: 1,
    });
  });
