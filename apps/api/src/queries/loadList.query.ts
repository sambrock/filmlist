import { eq } from 'drizzle-orm';
import z from 'zod';

import { middlewareDatabase, procedure } from '../lib/trpc';

export const loadList = procedure
  .use(middlewareDatabase)
  .input(z.string())
  .query(async ({ input, ctx }) => {
    const data = await ctx.db.query.lists.findFirst({
      where: (list) => eq(list.editId, input),
      with: {
        listMovies: {
          limit: 50,
          with: {
            movie: true,
          },
        },
      },
    });
    if (!data) {
      throw new Error('List not found');
    }

    const { listMovies, ...list } = data;

    return {
      list,
      movies: listMovies.map(({ order, movie }) => {
        return { ...movie, order };
      }),
    };
  });
