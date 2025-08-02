import { cookies as nextCookies } from 'next/headers';
import { z } from 'zod';

import { parseMoviesFromOutputStream, stream } from '@/lib/ai';
import { generateAuthToken } from '@/lib/auth';
import {
  createAnonymousUser,
  createMovie,
  createPendingUserAssistantMessages,
  createThread,
  getThreadMessages,
  Message,
  Movie,
  Thread,
  updateMessage,
} from '@/lib/drizzle';
import { findMovie, getMovieById } from '@/lib/tmdb';

export const maxDuration = 30;
// export const runtime = 'edge';
// export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  threadId: z.string().optional(),
  userId: z.string().optional(),
  model: z.string(),
  content: z.string(),
});

export const POST = async (request: Request) => {
  const body = await request.json();
  const cookies = await nextCookies();

  const parsed = bodySchema.safeParse(body);
  if (parsed.success === false) {
    return Response.json(parsed.error, { status: 400 });
  }

  let userId = parsed.data.userId;
  let threadId = parsed.data.threadId;
  let thread: Thread | null = null;

  if (!userId) {
    const user = await createAnonymousUser();
    userId = user.userId;

    cookies.set('auth-token', generateAuthToken(user));
  }

  if (!threadId) {
    thread = await createThread(userId);
    threadId = thread.threadId;
  }

  const { model, content } = parsed.data;

  const messages = parsed.data.threadId ? await getThreadMessages(threadId) : [];
  const [messageUser, messageAssistant] = await createPendingUserAssistantMessages(threadId, model, content);

  const outputStream = await stream(model, [...messages, messageUser]);

  const responseStream = new ReadableStream({
    async start(controller) {
      const outputReader = outputStream.textStream.getReader();

      if (thread) {
        controller.enqueue(encodeSSE({ type: 'thread', v: thread }));
      }
      controller.enqueue(encodeSSE({ type: 'pending', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'pending', v: messageAssistant }));

      while (true) {
        const { done, value } = await outputReader.read();
        if (done) break;

        messageAssistant.content += value;

        controller.enqueue(encodeSSE({ type: 'content', v: value }));
      }

      messageAssistant.structured = await Promise.all(
        parseMoviesFromOutputStream(messageAssistant.content).map(async (parsedOutput) => {
          const found = await findMovie(parsedOutput.title, parsedOutput.releaseYear);
          if (!found) return parsedOutput;

          const source = await getMovieById(found.id);
          if (!source) return parsedOutput;

          const movie = await createMovie(source);

          controller.enqueue(encodeSSE({ type: 'movie', v: movie }));

          return {
            ...parsedOutput,
            tmdbId: movie.tmdbId,
          };
        })
      );

      messageUser.status = 'done';
      messageAssistant.status = 'done';

      await updateMessage(messageUser.messageId, messageUser);
      await updateMessage(messageAssistant.messageId, messageAssistant);

      controller.enqueue(encodeSSE({ type: 'done', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'done', v: messageAssistant }));

      controller.enqueue(encodeSSE({ type: 'end' }));
      controller.enqueue(encodeSSE('end'));

      controller.close();
    },
  });

  return new Response(responseStream, {
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
  | { type: 'pending'; v: Message }
  | { type: 'done'; v: Message }
  | { type: 'content'; v: string }
  | { type: 'movie'; v: Movie }
  | { type: 'end' };

const encodeSSE = (data: ChatSSEData | 'end') => {
  if (data === 'end') {
    return new TextEncoder().encode(`event: end\ndata: \n\n`);
  }
  return new TextEncoder().encode(`event: delta\ndata: ${JSON.stringify(data)}\n\n`);
};
