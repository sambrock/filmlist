import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { baseProcedure } from '../init';

export type GetChatMessagesInput = z.infer<typeof getChatMessagesInput>;

export const getChatMessagesInput = z.object({
  threadId: z.string(),
  limit: z.number().optional().default(20),
  cursor: z
    .number()
    .optional()
    .default(() => Date.now()),
});

export const getChatMessagesProcedure = baseProcedure.input(getChatMessagesInput).query(async (opts) => {
  const { threadId, limit, cursor } = opts.input;

  const messages = await db.query.messages.findMany({
    where: (messages, { and, eq, lt }) =>
      and(eq(messages.threadId, threadId), lt(messages.createdAt, new Date(cursor))),
    with: {
      messageMovies: {
        with: {
          movie: true,
        },
      },
    },
    orderBy: (messages, { desc }) => desc(messages.createdAt),
    limit,
  });

  const messagesWithMovies = messages.map(({ messageMovies, ...message }) => ({
    ...message,
    movies: messageMovies.map((mm) => mm.movie),
  }));

  console.log(messagesWithMovies);

  return {
    messages: messagesWithMovies,
    nextCursor: messages.length > 0 ? messages[messages.length - 1].createdAt.getTime() : null,
  };
});
