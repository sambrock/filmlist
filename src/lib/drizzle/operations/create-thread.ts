import { uuid } from '@/lib/utils';
import { db } from '../db';
import { threads } from '../schema';

export const createThread = async (userId: string) => {
  const [thread] = await db
    .insert(threads)
    .values({
      threadId: uuid(),
      userId,
      title: '',
      model: 'gpt-4o',
    })
    .returning();

  return thread;
};
