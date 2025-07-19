import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';

import { baseMessage, parseRecommendationsFromResponse } from '@/lib/ai';
import {
  db,
  MessageInsert,
  messages,
  Movie,
  movies,
  recommendations,
  RecommendationWithMovie,
} from '@/lib/drizzle';
import { findMovie, getMovieById } from '@/lib/tmdb';
import { generateUuid } from '@/lib/utils';

export const maxDuration = 30;
// export const runtime = 'edge';
// export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  threadId: z.string(),
  model: z.string(),
  content: z.string(),
});

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const parsed = bodySchema.safeParse(body);
  if (parsed.success === false) {
    return NextResponse.json(parsed.error, { status: 400 });
  }

  const { threadId, model, content } = parsed.data;

  const stream = streamText({
    model: openai('gpt-4.1-nano'),
    messages: [{ role: 'user', content: baseMessage(content) }],
  });

  const dataStream = new ReadableStream({
    async start(controller) {
      let contentSoFar = '';

      const reader = stream.textStream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        controller.enqueue(encodeSSE({ type: 'content', v: value }));
        contentSoFar += value;
      }

      const userMessageId = generateUuid();

      const [userMessage, assistantMessage] = await db
        .insert(messages)
        .values([
          {
            messageId: userMessageId,
            threadId,
            content,
            model,
            role: 'user',
          },
          {
            messageId: generateUuid(),
            threadId,
            parentId: userMessageId,
            content: contentSoFar,
            model,
            role: 'assistant',
          },
        ])
        .returning();

      controller.enqueue(encodeSSE({ type: 'message', v: userMessage }));
      controller.enqueue(encodeSSE({ type: 'message', v: assistantMessage }));

      const recommendationsWithMovie = await Promise.all(
        parseRecommendationsFromResponse(contentSoFar).map(async (generated) => {
          const found = await findMovie(generated.title, generated.releaseYear);
          if (!found) return;

          const movieWithCredits = await getMovieById(found.id);
          if (!movieWithCredits) return;

          console.dir(movieWithCredits, { depth: Infinity });

          const movie: Movie = {
            movieId: movieWithCredits.id,
            source: movieWithCredits,
            createdAt: new Date(),
          };

          await db.insert(movies).values(movie).onConflictDoNothing();

          const [recommendation] = await db
            .insert(recommendations)
            .values({
              messageId: assistantMessage.messageId,
              recommendationId: generateUuid(),
              movieId: movie.movieId,
              releaseYear: generated.releaseYear,
              title: generated.title,
              why: generated.why,
            })
            .onConflictDoNothing()
            .returning();

          return { ...recommendation, movie };
        })
      );

      // @ts-expect-error: todo fix
      controller.enqueue(encodeSSE({ type: 'recommendations', v: recommendationsWithMovie }));

      controller.enqueue(encodeSSE({ type: 'end' }));
      controller.enqueue(encodeSSE('end'));
      controller.close();
    },
  });

  return new NextResponse(dataStream, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
};

export type ChatSSEData =
  | { type: 'content'; v: string }
  | { type: 'message'; v: MessageInsert }
  | { type: 'recommendations'; v: RecommendationWithMovie[] }
  | { type: 'end' };

const encodeSSE = (data: ChatSSEData | 'end') => {
  if (data === 'end') {
    return new TextEncoder().encode(`event: end\ndata: \n\n`);
  }
  return new TextEncoder().encode(`event: delta\ndata: ${JSON.stringify(data)}\n\n`);
};
