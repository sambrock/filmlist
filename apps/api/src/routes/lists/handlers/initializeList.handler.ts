import { lists } from '@repo/drizzle';
import { generateEditReadIds } from '@repo/lib/utils/list';
import { STATUS_CODE } from '@/lib/constants';
import { AppRouteHandler } from '@/lib/openapi';
import { InitializeListRoute } from '../lists.routes';

export const initializeList: AppRouteHandler<InitializeListRoute> = async (c) => {
  const { db } = c.env;
  const { clientId } = c.var;

  const { editId, readId } = generateEditReadIds();

  const [data] = await db
    .insert(lists)
    .values({
      editId,
      readId,
      clientId,
      title: '',
      description: '',
      locked: false,
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
      clientId: lists.clientId,
      updatedAt: lists.updatedAt,
    });

  return c.json(data, STATUS_CODE.CREATED);
};
