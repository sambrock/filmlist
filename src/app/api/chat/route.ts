import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import { fetchMutation, fetchQuery } from 'convex/nextjs';
import z from 'zod';

import { api } from '@/infra/convex/_generated/api';
import { Doc } from '@/infra/convex/_generated/dataModel';
import { tmdbFindMovie, tmdbGetMovieById } from '@/lib/tmdb/client';
import { modelResponseTextToMoviesArr } from '@/lib/utils';

const BodySchema = z.object({
  threadId: z.string(),
  messageId: z.string(),
  content: z.string(),
  model: z.string(),
});

export type ChatBodySchema = z.infer<typeof BodySchema>;

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = BodySchema.safeParse(body);
  if (parsed.success === false) {
    return new Response('Invalid request body', { status: 400 });
  }

  const { threadId, messageId, content, model } = parsed.data;

  const [thread, messages] = await Promise.all([
    fetchQuery(api.threads.getByThreadId, { threadId }),
    fetchQuery(api.messages.getByThreadId, { threadId }),
  ]);

  const response = streamText({
    model: openai('gpt-4o-mini'),
    messages: [
      { role: 'system', content: SYSTEM_CONTEXT_MESSAGE },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: content },
    ],
    onFinish: async (message) => {
      if (message.content[0].type !== 'text') return;

      const finalContent = message.content[0].text;

      // Find movies from the model response
      const movies = await Promise.all(
        modelResponseTextToMoviesArr(finalContent).map(async (movie) => {
          const found = await tmdbFindMovie(
            movie.title,
            new Date(movie.releaseDate).getFullYear().toString()
          );
          if (!found) {
            return {
              found: false,
              title: movie.title,
              why: movie.why,
              releaseDate: new Date(movie.releaseDate).toISOString(),
            };
          }

          const source = await tmdbGetMovieById(found.id);
          if (!source) {
            return {
              found: false,
              why: movie.why,
              title: movie.title,
              releaseDate: new Date(movie.releaseDate).toISOString(),
            };
          }

          return {
            found: true,
            why: movie.why,
            tmdbId: source.id,
            title: source.title,
            runtime: source.runtime!,
            genres: source.genres!.map((g) => g.name as string),
            overview: source.overview!,
            releaseDate: new Date(source.release_date!).toISOString(),
            backdropPath: source.backdrop_path!,
            posterPath: source.poster_path!,
          };
        })
      );

      // Save final message content and movies
      await fetchMutation(api.messages.update, {
        messageId,
        data: {
          content: finalContent,
          status: 'done',
          movies: movies as Doc<'messages'>['movies'], // TODO: fix this type
        },
      });

      if (thread && !thread.title) {
        const generateThreadTitle = await generateText({
          model: openai('gpt-4o-mini'),
          prompt: `Generate a short title for this prompt in 3 words or less (don't use the word "movie"): "Movie picks for prompt: ${content}"`,
        });

        await fetchMutation(api.threads.update, {
          threadId,
          data: {
            title:
              generateThreadTitle.content[0].type === 'text'
                ? generateThreadTitle.content[0].text
                : 'New chat',
          },
        });
      }
    },
  });

  return response.toTextStreamResponse();
}

const SYSTEM_CONTEXT_MESSAGE = `
  You are a movie recommendation AI.

  Suggest exactly **4 existing movies** based on conversations.
  Do not suggest TV series. Just existing movies.

  Return the result as a **JSON array of 4 objects**.  
  Each object must have the following keys:

  - **title**: string  
  - **release_year**: number (e.g., 2010)  
  - **why**: string (explain briefly why you recommend it)  

  Example output:
  [
    {
      "title": "Inception",
      "release_year": 2010,
      "why": "A mind-bending thriller with emotional depth."
    }
  ]
`;
