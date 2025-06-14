import { Readable } from 'stream';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { ROLE_ASSISTANT, ROLE_USER } from '@/lib/constants';
import { db } from '@/lib/drizzle/db';
import { messages, threads } from '@/lib/drizzle/schema';
import { openaiClient } from '@/lib/openai/client';
import { supportedModelsEnum } from '@/lib/openai/models';
import { tmdbClient } from '@/lib/tmdb/client';
import { ChatMessage } from '@/lib/types';
import { findMoviesFromCompletionString } from '@/lib/utils/parse-completion';
import { generateUuid } from '@/lib/utils/uuid';
import { baseProcedure } from '../init';

export type ChatInput = z.infer<typeof chatInput>;

export const chatInput = z.object({
  messageId: z.string(),
  threadId: z.string(),
  content: z.string(),
  model: z.enum(supportedModelsEnum),
});

export const chatProcedure = baseProcedure.input(chatInput).subscription(async (opts) => {
  const { messageId, threadId, content, model } = opts.input;

  await db.insert(messages).values({
    messageId,
    threadId,
    content,
    model,
    role: ROLE_USER,
  });

  await db.update(threads).set({ model }).where(eq(threads.threadId, threadId));

  const completionStream = openaiClient.chat.completions.stream({
    model,
    messages: [
      {
        role: ROLE_USER,
        content: `You are a movie recommendation AI. Suggest 5 movies that are "${opts.input.content}". For each movie title and release year. Format the output as a JSON array of objects with 'title' and 'release_year' keys. Only suggest existing movies.`,
      },
    ],
  });

  const readableStream = new Readable({
    encoding: 'utf-8',
    read() {},
  });

  const assistantMessage: ChatMessage = {
    messageId: generateUuid(),
    threadId,
    content: '',
    model,
    role: ROLE_ASSISTANT,
    movies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const foundMovies: { title: string; release_year: number }[] = [];

  completionStream.on('content', async (content) => {
    assistantMessage.content += content;
    readableStream.push(JSON.stringify(assistantMessage), 'utf-8');
  });

  completionStream.on('finalContent', async (content) => {
    assistantMessage.content = content;
    console.log('FINAL CONTENT:', assistantMessage.content);
    readableStream.push(JSON.stringify(assistantMessage), 'utf-8');
  });

  completionStream.on('end', async () => {
    const parsedMovies = findMoviesFromCompletionString(assistantMessage.content);
    console.log('PARSED MOVIES:', parsedMovies);

    await Promise.all(
      parsedMovies.map(async ({ title, release_year }) => {
        if (foundMovies.some((movie) => movie.title === title && movie.release_year === release_year)) {
          return; // Skip if movie already processed
        } else {
          foundMovies.push({ title, release_year }); // Add to found movies
        }
        if (
          assistantMessage.movies.some(
            (movie) => movie.title === title && new Date(movie.releaseDate).getFullYear() === release_year
          )
        ) {
          return; // Skip if movie already exists
        }

        const { data } = await tmdbClient.GET('/3/search/movie', {
          params: {
            query: {
              query: title,
              year: release_year.toString(),
              primary_release_year: release_year.toString(),
            },
          },
        });

        if (!data || !data.results || data.results.length === 0) {
          return; // Skip if no results found
        }
        const movie = data.results[0];
        if (!movie.id || !movie.title || !movie.backdrop_path || !movie.poster_path || !movie.release_date) {
          return; // Skip if movie data is incomplete
        }

        assistantMessage.movies.push({
          movieId: generateUuid(),
          tmdbId: movie.id,
          title: movie.title,
          backdropPath: movie.backdrop_path,
          posterPath: movie.poster_path,
          releaseDate: new Date(movie.release_date),
          createdAt: new Date(),
        });
      })
    );

    readableStream.push(JSON.stringify(assistantMessage), 'utf-8');

    await db.insert(messages).values(assistantMessage);

    readableStream.push(null); // End stream
  });

  return readableStream;
});
