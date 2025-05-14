import { ListMovie, listMovies, Movie, movies } from '@repo/drizzle';
import { AppRouteHandler } from '@/lib/openapi';
import { SavePatchesRoute } from '../patches.routes';

export const savePatches: AppRouteHandler<SavePatchesRoute> = async (c) => {
  const { db } = c.env;

  const body = c.req.valid('json');

  // TODO: use transactions (not supported by drizzle / D1?)

  for (const patches of body) {
    for await (const patch of patches) {
      const { op, path, value } = patch;
      const [table] = path;

      const concat = `${op}.${table}` as const;

      switch (concat) {
        case 'add.movies': {
          const data = value as Movie;
          const exists = await db.query.movies.findFirst({
            where: (movies, { eq }) => eq(movies.movieId, data.movieId),
          });
          if (!exists) {
            await db.insert(movies).values({
              movieId: data.movieId,
              tmdbId: data.tmdbId,
              title: data.title,
              posterPath: data.posterPath,
              releaseDate: data.releaseDate,
              createdAt: new Date(),
            });
          }
          break;
        }

        case 'add.listMovies': {
          const data = value as ListMovie;
          await db.insert(listMovies).values({
            listId: data.listId,
            movieId: data.movieId,
            order: data.order,
            createdAt: new Date(),
          });
          break;
        }
      }

      // console.log([op, path, value]);
    }
  }

  return c.json({});
};
