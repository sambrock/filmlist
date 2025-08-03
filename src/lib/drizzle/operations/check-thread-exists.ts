import { db } from '../db';

export const checkThreadExists = async (threadId: string) => {
  const thread = await db.query.threads.findFirst({
    where: (threads, { eq }) => eq(threads.threadId, threadId),
  });

  return thread;
};
