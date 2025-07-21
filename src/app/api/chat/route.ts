import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';

import { baseMessage, parseRecommendationsFromResponse } from '@/lib/ai';
import {
  db,
  Message,
  MessageAssistant,
  messages,
  MessageUser,
  Movie,
  movies,
  Recommendation,
  recommendations,
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

  const ops: Promise<unknown>[] = [];

  const messageUser: MessageUser = {
    messageId: generateUuid(),
    threadId,
    parentId: null,
    serial: -1,
    model,
    content,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const messageAssistant: MessageAssistant = {
    messageId: generateUuid(),
    threadId,
    parentId: messageUser.messageId,
    serial: -1,
    model,
    content: '',
    role: 'assistant',
    createdAt: new Date(),
    updatedAt: new Date(),
    recommendations: [],
  };

  ops.push(
    db.insert(messages).values({ ...messageUser, serial: undefined }),
    db.insert(messages).values({ ...messageAssistant, serial: undefined })
  );

  const stream = streamText({
    model: openai('gpt-4.1-nano'),
    messages: [{ role: 'user', content: baseMessage(content) }],
  });

  const dataStream = new ReadableStream({
    async start(controller) {
      const reader = stream.textStream.getReader();

      controller.enqueue(encodeSSE({ type: 'message', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'message', v: messageAssistant }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        controller.enqueue(encodeSSE({ type: 'content', v: value }));
        messageAssistant.content += value;
      }

      await Promise.all(
        parseRecommendationsFromResponse(messageAssistant.content).map(async (generated) => {
          const found = await findMovie(generated.title, generated.releaseYear);
          if (!found) return;

          const movieWithCredits = await getMovieById(found.id);
          if (!movieWithCredits) return;

          const movie: Movie = {
            movieId: movieWithCredits.id,
            source: movieWithCredits,
            createdAt: new Date(),
          };

          const recommendation: Recommendation = {
            recommendationId: generateUuid(),
            movieId: movie.movieId,
            messageId: messageAssistant.messageId,
            releaseYear: generated.releaseYear,
            title: generated.title,
            why: generated.why,
            createdAt: new Date(),
          };

          messageAssistant.recommendations.push({ ...recommendation, movie });

          ops.push(
            db.insert(movies).values(movie).onConflictDoNothing(),
            db.insert(recommendations).values(recommendation).onConflictDoNothing()
          );
        })
      );

      controller.enqueue(encodeSSE({ type: 'final', v: messageAssistant }));

      controller.enqueue(encodeSSE({ type: 'end' }));
      controller.enqueue(encodeSSE('end'));
      controller.close();

      for (const op of ops) {
        await op;
      }
      // todo: use neon batch in production?
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
  | { type: 'message'; v: Message }
  | { type: 'final'; v: MessageAssistant }
  | { type: 'end' };

const encodeSSE = (data: ChatSSEData | 'end') => {
  if (data === 'end') {
    return new TextEncoder().encode(`event: end\ndata: \n\n`);
  }
  return new TextEncoder().encode(`event: delta\ndata: ${JSON.stringify(data)}\n\n`);
};
