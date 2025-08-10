import { cookies } from 'next/headers';
import z from 'zod';

import { generateAuthToken, User, verifyAuthToken } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { MessageUserAssistantSchema } from '@/lib/drizzle/types';
import { draftUuid } from '@/lib/utils/uuid';
import { protectedProcedure, publicProcedure, router } from './trpc';

export type AppRouter = typeof appRouter;

export const appRouter = router({
  /**
   * Get the current user based on the auth token.
   * If no token is present, it creates an anonymous user and sets a cookie.
   */
  getUser: publicProcedure.query(async ({ ctx }) => {
    if (ctx.token) {
      const verified = verifyAuthToken(ctx.token);
      if (verified) return verified;
    }

    const anonUser: User = { userId: draftUuid(), anon: true };

    const cookieStore = await cookies();
    cookieStore.set('auth-token', generateAuthToken(anonUser), {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'strict',
    });

    return anonUser;
  }),

  getUserThreads: protectedProcedure.input(z.object({ userId: z.string() })).query(async ({ input }) => {
    const threads = await db.query.threads.findMany({
      where: (threads, { eq }) => eq(threads.userId, input.userId),
      orderBy: (threads, { desc }) => [desc(threads.createdAt)],
    });

    return threads;
  }),

  getThreadMessages: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
        cursor: z.number().nullish().default(0),
        limit: z.number().optional().default(20),
        direction: z.enum(['forward', 'backward']).optional(),
      })
    )
    .output(
      z.object({
        messages: MessageUserAssistantSchema.array(),
        nextCursor: z.number(),
      })
    )
    .query(async ({ input }) => {
      const messages = await db.query.messages.findMany({
        where: (messages, { and, eq, lt }) =>
          and(
            eq(messages.threadId, input.threadId),
            input.cursor ? lt(messages.serial, input.cursor) : undefined
          ),
        orderBy: (messages, { desc }) => [desc(messages.serial)],
        with: {
          movies: {
            with: { movie: true },
          },
        },
        limit: input.limit,
      });

      const nextCursor = messages.length > 0 ? messages[messages.length - 1].serial : 0;

      const messagesWithMovies = messages.map((message) => ({
        ...message,
        movies: message.movies.map((m) => m.movie),
      }));

      return { nextCursor, messages: messagesWithMovies };
    }),
});
