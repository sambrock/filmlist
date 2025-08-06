import { db } from '../db';
import { threads } from '../schema';
import { ThreadInsert } from '../zod';

export const createThread = async (data: ThreadInsert) => {
  const [thread] = await db
    .insert(threads)
    .values({
      ...data,
      userId: data.userId.replace('anon:', ''),
    })
    .returning();

  return thread;
};
