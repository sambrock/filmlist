import { baseProcedure, createTRPCRouter } from '../init';

export type AppRouter = typeof appRouter;

export const appRouter = createTRPCRouter({
  hello: baseProcedure.query(() => {
    return { message: 'Hello from the app router!' };
  }),

  // createThread: baseProcedure,
  //   .input(
  //     z.object({
  //       title: z.string(),
  //       userId: z.string(),
  //     })
  //   )
  //   .mutation(async (opts) => {
  //     return fetchMutation(api.threads.createThread, {
  //       title: opts.input.title,
  //       owner: opts.input.userId as Id<'users'>,
  //     });
  //   }),

  // chat: baseProcedure
  //   .input(
  //     z.object({
  //       threadId: z.string(),
  //       content: z.string(),
  //     })
  //   )
  //   .mutation(async (opts) => {
  //     try {
  //       await fetchMutation(api.messages.createUserMessage, {
  //         threadId: opts.input.threadId as Id<'threads'>,
  //         content: opts.input.content,
  //       });

  //       const completion = await getModelCompletion(opts.input.content);

  //       const parsed = parseCompletionToMovies(completion || '');
  //       console.log(parsed);

  //       await fetchMutation(api.messages.createAssistantMessage, {
  //         threadId: opts.input.threadId as Id<'threads'>,
  //         content: completion || 'No response from model',
  //       });

  //       return {};
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }),

  // messages: baseProcedure
  //   .input(
  //     z.object({
  //       threadId: z.string(),
  //     })
  //   )
  //   .query(async (opts) => {
  //     return fetchQuery(api.messages.getThreadMessages, {
  //       threadId: opts.input.threadId as Id<'threads'>,
  //     });
  //   }),

  // initAnonUser: baseProcedure
  //   .input(
  //     z.object({
  //       userId: z.string(),
  //     })
  //   )
  //   .mutation(async (opts) => {
  //     return fetchMutation(api.users.initAnonUser, {
  //       userId: opts.input.userId,
  //     });
  //   }),

  // getUserThreads: baseProcedure
  //   .input(
  //     z.object({
  //       userId: z.string(),
  //     })
  //   )
  //   .query(async (opts) => {
  //     return fetchQuery(api.threads.getUserThreads, {
  //       userId: opts.input.userId as Id<'users'>,
  //     });
  //   }),
});
