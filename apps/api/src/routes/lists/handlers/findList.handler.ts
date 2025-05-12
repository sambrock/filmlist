import { AppRouteHandler } from '@/lib/openapi';

import { FindListRoute } from '../lists.routes';

export const findList: AppRouteHandler<FindListRoute> = async (c) => {
  const { db } = c.env;

  const data = await db.query.lists.findFirst({
    where: (lists, { eq }) => eq(lists.editId, c.req.param('listId')),
  });

  if (!data) {
    throw new Error('List not found');
  }

  return c.json(data);
};
