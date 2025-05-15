import { lists } from '@repo/drizzle';
import { STATUS_CODE } from '@/lib/constants';
import { AppRouteHandler } from '@/lib/openapi';
import { InitializeListRoute } from '../lists.routes';

export const initializeList: AppRouteHandler<InitializeListRoute> = async (c) => {
  const { db } = c.env;
  const { clientId } = c.var;

  const [data] = await db
    .insert(lists)
    .values({
      title: 'Untitled',
      owner: clientId,
    })
    .returning({
      title: lists.title,
      description: lists.description,
      editId: lists.editId,
      createdAt: lists.createdAt,
      lastUpdate: lists.lastUpdate,
      listId: lists.listId,
      readId: lists.readId,
      locked: lists.locked,
      owner: lists.owner,
      updatedAt: lists.updatedAt,
    });

  return c.json(data, STATUS_CODE.CREATED);
};
