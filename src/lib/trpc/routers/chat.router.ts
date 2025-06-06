import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { insertMessageSchema, messages } from '@/lib/drizzle/schema';
import { openai } from '@/lib/openai';
import { findMoviesFromCompletionString } from '@/lib/utils/parse-completion';
import { baseProcedure, createTRPCRouter } from '../init';

export const chatRouter = createTRPCRouter({
  chat: baseProcedure.input(insertMessageSchema).mutation(async (opts) => {
    await db.insert(messages).values({
      messageId: opts.input.messageId,
      threadId: opts.input.threadId,
      content: opts.input.content,
      role: 'user',
      model: opts.input.model,
    });

    // const moviesFound: Set<[string, number]> = new Set();
    let completionMessage = '';

    const foundMovies = new Map<
      number,
      { title: string; releaseYear: number; status: 'success' | 'pending' }
    >();

    const completionStream = openai.chat.completions.stream({
      model: 'meta-llama/llama-3.3-8b-instruct:free',
      messages: [
        {
          role: 'user',
          content: `You are a movie recommendation AI. Suggest 5 movies that are "${opts.input.content}". For each movie title and release year. Format the output as a JSON array of objects with 'title' and 'release_year' keys. Only suggest existing movies.`,
        },
      ],
    });

    // completionStream.on('chunk', async (data) => {
    //   console.log('chunk', data);
    // });

    // completionStream.on('message', async (data) => {
    //   console.log('message', data);
    // });

    // completionStream.on('chatCompletion', async (data) => {
    //   console.log('chatCompletion', data);
    // });

    completionStream.on('content', async (content) => {
      console.log('content', content);
      completionMessage += content;
      const movies = findMoviesFromCompletionString(completionMessage);
      movies.map((movie, index) => {
        if (foundMovies.has(index)) return;
        foundMovies.set(index, {
          title: movie.title,
          releaseYear: movie.release_year,
          status: 'pending',
        });
      });
    });

    completionStream.on('finalContent', async (content) => {
      completionMessage = content;
      // const movies = findMoviesFromCompletionString(completionMessage);
      // // console.log('MOVIES', movies);/
    });

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

    // await db.insert(messages).values({
    //   messageId: generateUuid(),
    //   threadId: opts.input.threadId,
    //   content: 'Pong!',
    //   role: 'assistant',
    //   model: opts.input.model,
    // });
  }),

  timeStream: baseProcedure
    .input(z.object({ intervalMs: z.number().default(1000) }))
    .subscription(async function* ({ input }) {
      const intervalMs = input.intervalMs;

      while (true) {
        yield new Date().toISOString();
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    }),
});
