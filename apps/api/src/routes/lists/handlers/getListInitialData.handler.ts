import { AppRouteHandler } from '@/lib/openapi';
import { GetListInitialDataRoute } from '../lists.routes';

export const getListInitialData: AppRouteHandler<GetListInitialDataRoute> = async (c) => {
  const { db } = c.env;
  const clientId = c.get('clientId');

  const data = await db.query.lists.findFirst({
    where: (lists, { eq }) => eq(lists.owner, clientId),
    orderBy: (lists, { desc }) => desc(lists.createdAt),
    with: {
      listMovies: {
        with: {
          movie: true,
        },
        limit: 30,
      },
    },
  });

  if (!data) {
    throw new Error('List not found');
  }

  const { listMovies, ...list } = data;

  return c.json({
    list: list,
    listMovies: listMovies.map((listMovie) => {
      const { movie, ...rest } = listMovie;
      return rest;
    }),
    movies: listMovies.map((listMovie) => listMovie.movie),
  });
};
