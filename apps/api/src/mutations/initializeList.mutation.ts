import { lists } from '@filmlist/drizzle';
import { middlewareDatabase, procedure } from '../lib/trpc';

export const initializeList = procedure.use(middlewareDatabase).mutation(async ({ ctx }) => {
  const count = await ctx.db.$count(lists);

  await ctx.db.insert(lists).values({
    title: `Untitled #${count + 1}`,
    owner: 'test',
  });
});
