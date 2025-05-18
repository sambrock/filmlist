import { STATUS_CODE } from '@/lib/constants';
import { AppRouteHandler } from '@/lib/openapi';
import { GetInitialDataRoute } from '../lists.routes';

export const getInitialData: AppRouteHandler<GetInitialDataRoute> = async (c) => {
  const { db } = c.env;
  const { clientId } = c.var;
  const { editId, readId } = c.req.query();

  const data = await db.query.lists.findFirst({
    where: (lists, { eq }) => {
      if (editId) return eq(lists.editId, editId);
      if (readId) return eq(lists.readId, readId);
      return eq(lists.clientId, clientId);
    },
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
    return c.json({}, STATUS_CODE.NOT_FOUND);
  }

  const { listMovies, ...list } = data!;

  return c.json({
    list: list,
    listMovies: listMovies.map((listMovie) => {
      const { movie, ...rest } = listMovie;
      return rest;
    }),
    movies: listMovies.map((listMovie) => listMovie.movie),
  });
};
