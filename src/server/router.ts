import z from 'zod';

import { setAuthTokenCookie } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { library } from '@/lib/drizzle/schema';
import { MessageAssistantSchema, MessageUserSchema, User } from '@/lib/drizzle/types';
import { uuid } from '@/lib/utils';
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

    const unsavedAnonUser: User = { userId: uuid(), anon: true };
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
        direction: z.enum(['forward', 'backward']).optional(),
      })
    )
    .output(
      z.object({
        messages: z.union([MessageUserSchema, MessageAssistantSchema]).array(),
        nextCursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        return { messages: [], nextCursor: 0 };
      }

      const messages = await db.query.messages.findMany({
        where: (messages, { and, eq, lt }) =>
          and(
            eq(messages.chatId, input.chatId),
            input.cursor ? lt(messages.serial, input.cursor) : undefined
          ),
        with: {
          parent: true,
          movies: {
            with: {
              movie: {
                with: {
                  libraries: {
                    where: (library, { eq }) => eq(library.userId, ctx.user!.userId),
                  },
                },
              },
            },
          },
        },
        orderBy: (messages, { desc }) => [desc(messages.serial)],
        limit: 8,
      });

      console.log(
        messages.length,
        messages.map((m) => m.serial)
      );

      return {
        messages: messages.map((message) => {
          if (message.role === 'user') return MessageUserSchema.parse(message);
          return MessageAssistantSchema.parse({
            ...message,
            movies: message.movies.map((m) => ({
              ...m.movie,
              liked: m.movie.libraries[0]?.liked || false,
              watched: m.movie.libraries[0]?.watched || false,
              watchlist: m.movie.libraries[0]?.watchlist || false,
            })),
          });
        }),
        nextCursor: messages.length > 0 ? messages[messages.length - 1].serial : 0,
      };
    }),

  /**
   *
   */
  updateLibrary: publicProcedure
    .input(
      z.object({
        movieId: z.number(),
        liked: z.boolean().optional(),
        watched: z.boolean().optional(),
        watchlist: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        return;
      }

      const userMovieExists = await db.query.library.findFirst({
        where: (library, { and, eq }) =>
          and(eq(library.userId, ctx.user!.userId), eq(library.movieId, input.movieId)),
      });

      if (!userMovieExists) {
        await db.insert(library).values({
          userId: ctx.user!.userId,
          movieId: input.movieId,
          liked: input.liked,
          watched: input.watched,
          watchlist: input.watchlist,
        });
      } else {
        await db.update(library).set({
          liked: input.liked,
          watched: input.watched,
          watchlist: input.watchlist,
        });
      }

      return;
    }),
});
