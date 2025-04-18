import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { DrizzleDatabase, listMovieInsertSchema, listMovies, movies } from '@repo/drizzle';
import { tmdb } from '@repo/tmdb';
import { middlewareDatabase, procedure } from '../lib/trpc';

export const createListMovie = procedure
  .use(middlewareDatabase)
  .input(listMovieInsertSchema)
  .mutation(async ({ input, ctx }) => {
    await createMovie(input.movieId, ctx.db);

    await ctx.db.insert(listMovies).values({
      movieId: input.movieId,
      listId: input.listId,
      order: input.order,
    });
  });

const createMovie = async (movieId: number, db: DrizzleDatabase) => {
  const exists = await db.query.movies.findFirst({
    where: (movie) => eq(movie.tmdbId, movieId),
  });

  if (!exists) {
    const movie = await tmdb.client.GET('/3/movie/{movie_id}', {
      params: {
        path: {
          movie_id: movieId,
        },
      },
    });

    if (!movie || !movie.data) {
      throw new HTTPException(400, { message: 'Movie not found' });
    }

    await db
      .insert(movies)
      // @ts-ignore TODO: Fix this
      .values({
        movieId: movie.data.id,
        tmdbId: movie.data.id,
        title: movie.data.title!,
        overview: movie.data.overview!,
        posterPath: movie.data.poster_path!,
        backdropPath: movie.data.backdrop_path!,
        releaseDate: movie.data.release_date!,
      });
  }
};
