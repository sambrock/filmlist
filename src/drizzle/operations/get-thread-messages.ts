import { db } from '../db';

export const getThreadMessages = (threadId: string) => {
  return db.query.messages.findMany({
    where: (messages, { eq }) => eq(messages.threadId, threadId),
    orderBy: (messages, { asc }) => asc(messages.serial),
    columns: {
      role: true,
      content: true,
    },
  });
};
