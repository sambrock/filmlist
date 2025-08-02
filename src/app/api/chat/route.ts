import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { produce } from 'immer';
import { z } from 'zod';

import { baseMessage, parseMoviesFromAiResponse } from '@/lib/ai';
import { db, Message, MessageAssistant, messageMovies, messages, Movie, movies, Thread } from '@/lib/drizzle';
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

  const messageUser: Message = {
    messageId: generateUuid(),
    threadId,
    parentId: null,
    serial: 0,
    model,
    content,
    parsed: [],
    role: 'user',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const messageAssistant: Message = {
    messageId: generateUuid(),
    threadId,
    parentId: messageUser.messageId,
    serial: 0,
    model,
    content: '',
    parsed: [],
    role: 'assistant',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const stream = streamText({
    model: openai('gpt-4.1-nano'),
    messages: [{ role: 'user', content: baseMessage(content) }],
  });

  const moviesArr: Movie[] = [];

  const dataStream = new ReadableStream({
    async start(controller) {
      const reader = stream.textStream.getReader();

      controller.enqueue(encodeSSE({ type: 'message', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'message', v: messageAssistant }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        controller.enqueue(encodeSSE({ type: 'content', v: value, id: messageAssistant.messageId }));
        messageAssistant.content += value;
        messageAssistant.parsed = parseMoviesFromAiResponse(messageAssistant.content);
      }

      await Promise.all(
        messageAssistant.parsed!.map(async (generated, index) => {
          const found = await findMovie(generated.title, generated.releaseYear);
          if (!found) return;

          const tmdbMovie = await getMovieById(found.id);
          if (!tmdbMovie) return;

          const movie: Movie = {
            movieId: generateUuid(),
            tmdbId: tmdbMovie.id,
            source: tmdbMovie,
            createdAt: new Date(),
          };

          messageAssistant.parsed = produce(messageAssistant.parsed, (draft) => {
            if (!draft) return;
            draft[index].tmdbId = tmdbMovie.id;
          });

          moviesArr.push(movie);
        })
      );

      controller.enqueue(
        encodeSSE({ type: 'final', v: { ...messageAssistant, movies: moviesArr } as MessageAssistant })
      );

      controller.enqueue(encodeSSE({ type: 'end' }));
      controller.enqueue(encodeSSE('end'));
      controller.close();

      await db.insert(messages).values([
        { ...messageUser, serial: undefined, status: 'done' },
        { ...messageAssistant, serial: undefined, status: 'done' },
      ]);

      await db.insert(movies).values(moviesArr);

      await db.insert(messageMovies).values(
        moviesArr.map((movie) => ({
          messageId: messageAssistant.messageId,
          movieId: movie.movieId,
          createdAt: new Date(),
        }))
      );
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
  | { type: 'thread'; v: Thread }
  | { type: 'thread-title'; v: string }
  | { type: 'content'; v: string; id: string }
  | { type: 'message'; v: Message }
  | { type: 'final'; v: MessageAssistant }
  | { type: 'end' };

const encodeSSE = (data: ChatSSEData | 'end') => {
  if (data === 'end') {
    return new TextEncoder().encode(`event: end\ndata: \n\n`);
  }
  return new TextEncoder().encode(`event: delta\ndata: ${JSON.stringify(data)}\n\n`);
};
