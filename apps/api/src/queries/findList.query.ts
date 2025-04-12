import { eq } from 'drizzle-orm';
import z from 'zod';

import { middlewareDatabase, procedure } from '../lib/trpc';

export const findList = procedure
  .use(middlewareDatabase)
  .input(
    z.object({
      listId: z.number(),
    })
  )
  .query(async ({ input, ctx }) => {
    const movies = await ctx.db.query.listMovies.findMany({
      where: (listMovie) => eq(listMovie.listId, input.listId),
      with: {
        movie: true,
      },
    });

    return movies;
  });
