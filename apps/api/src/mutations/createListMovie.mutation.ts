import { eq } from 'drizzle-orm';
import z from 'zod';

import { listMovies, movies } from '@filmlist/drizzle';
import { createUrlSlug } from '@filmlist/lib/utils';
import { tmdb } from '@filmlist/tmdb';
import { middlewareDatabase, procedure } from '../lib/trpc';

export const createListMovie = procedure
  .use(middlewareDatabase)
  .input(
    z.object({
      editId: z.string(),
      tmdbId: z.number(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const movie = await tmdb.client.GET('/3/movie/{movie_id}', {
      params: {
        path: {
          movie_id: input.tmdbId,
        },
      },
    });

    if (!movie || !movie.data) {
      throw new Error('Movie not found');
    }

    const [{ movieId }] = await ctx.db
      .insert(movies)
      .values({
        tmdbId: movie.data.id,
        title: movie.data.title!,
        overview: movie.data.overview!,
        posterPath: movie.data.poster_path!,
        backdropPath: movie.data.backdrop_path!,
        releaseDate: movie.data.release_date!,
        slug: createUrlSlug(movie.data.title!),
      })
      .returning({ movieId: movies.movieId });

    const list = await ctx.db.query.lists.findFirst({
      where: (list) => eq(list.editId, input.editId),
    });

    if (!list) {
      throw new Error('List not found');
    }

    await ctx.db.insert(listMovies).values({
      listId: list.listId,
      movieId: movieId,
      order: 1,
    });
  });
