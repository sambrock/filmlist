import z from 'zod';

import { setAuthTokenCookie } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { MessageAssistantSchema, MessageUserSchema, User } from '@/lib/drizzle/types';
import { unsavedUuid } from '@/lib/utils/uuid';
import { publicProcedure, router } from './trpc';

export type AppRouter = typeof appRouter;

export const appRouter = router({
  /**
   * Get the current user based on the auth token.
   * If no token is present, it creates an unsaved anonymous user id and sets a cookie.
   */
  getUser: publicProcedure.query(async ({ ctx }) => {
    if (ctx.user) {
      return ctx.user;
    }

    const unsavedAnonUser: User = { userId: unsavedUuid(), anon: true };
    await setAuthTokenCookie(unsavedAnonUser);

    return unsavedAnonUser;
  }),

  /**
   *
   */
  getChats: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ input }) => {
    const chats = await db.query.chats.findMany({
      where: (chats, { eq }) => eq(chats.userId, input.userId),
      orderBy: (chats, { desc }) => [desc(chats.createdAt)],
    });

    return chats;
  }),

  /**
   *
   */
  getChatMessages: publicProcedure
    .input(
      z.object({
        chatId: z.string(),
        cursor: z.number().nullish().default(0),
        limit: z.number().optional().default(20),
        direction: z.enum(['forward', 'backward']).optional(),
      })
    )
    .output(
      z.object({
        messages: z.union([MessageUserSchema, MessageAssistantSchema]).array(),
        nextCursor: z.number().nullish(),
      })
    )
    .query(async ({ input }) => {
      const messages = await db.query.messages.findMany({
        where: (messages, { and, eq, lt }) =>
          and(
            eq(messages.chatId, input.chatId),
            input.cursor ? lt(messages.serial, input.cursor) : undefined
          ),
        with: {
          parent: true,
          movies: {
            with: { movie: true },
          },
        },
        orderBy: (messages, { desc }) => [desc(messages.serial)],
        limit: input.limit,
      });

      return {
        messages: messages.map((message) => {
          if (message.role === 'user') return MessageUserSchema.parse(message);
          return MessageAssistantSchema.parse({ ...message, movies: message.movies.map((m) => m.movie) });
        }),
        nextCursor: messages.length > 0 ? messages[messages.length - 1].serial : 0,
      };
    }),
});
