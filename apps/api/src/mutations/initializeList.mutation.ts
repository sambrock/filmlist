import { lists } from '@filmlist/drizzle';
import { Context } from '../lib/trpc';

export const initializeListHandler = async (ctx: Context) => {
  const { db } = ctx;

  await db.insert(lists).values({
    publicId: 'test',
    title: 'untitled',
  });

  return;
};
