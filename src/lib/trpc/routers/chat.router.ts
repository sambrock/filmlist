import { db } from '@/lib/drizzle/db';
import { insertMessageSchema, messages } from '@/lib/drizzle/schema';
import { generateUuid } from '@/lib/utils/uuid';
import { baseProcedure, createTRPCRouter } from '../init';

export const chatRouter = createTRPCRouter({
  chat: baseProcedure.input(insertMessageSchema).mutation(async (opts) => {
    await db.transaction(async (tx) => {
      await tx.insert(messages).values({
        messageId: opts.input.messageId,
        threadId: opts.input.threadId,
        content: opts.input.content,
        role: 'user',
        model: opts.input.model,
      });
      

      // const completion = await createCompletion(opts.input.content);

      // if (!completion.success) {
      //   await tx.insert(messages).values({
      //     messageId: generateUuid(),
      //     threadId: opts.input.threadId,
      //     content: opts.input.content,
      //     role: 'assistant',
      //     model: opts.input.model,
      //   });

      //   return;
      // }

      await tx.insert(messages).values({
        messageId: generateUuid(),
        threadId: opts.input.threadId,
        content: 'Pong!',
        role: 'assistant',
        model: opts.input.model,
      });

      // const parsed = parseCompletionToMovies(completion.data);

      // const movies = await Promise.all(
      //   parsed.map(async (movie) => {
      //     const { data } = await tmdbApi.GET('/3/search/movie', {
      //       params: {
      //         query: {
      //           query: movie.title,
      //           year: movie.release_year.toString(),
      //           primary_release_year: movie.release_year.toString(),
      //         },
      //       },
      //     });

      //     return data?.results?.[0] || null;
      //   })
      // );

      // console.log('movies', movies);
    });
  }),
});
