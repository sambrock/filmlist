import { z } from 'zod';

import { parseMoviesFromOutputStream, stream } from '@/lib/ai';
import { readAuthTokenCookie, setAuthTokenCookie } from '@/lib/auth';
import {
  createAnonymousUser,
  createMovie,
  createPendingUserAssistantMessages,
  createThread,
  getThreadMessages,
  Message,
  Movie,
  updateMessage,
} from '@/drizzle';
import { findMovie, getMovieById } from '@/lib/tmdb';

export const maxDuration = 30;
// export const runtime = 'edge';
// export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  threadId: z.string(),
  userId: z.string(),
  model: z.string(),
  content: z.string(),
});

export const POST = async (request: Request) => {
  const user = await readAuthTokenCookie();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (parsed.success === false) {
    return Response.json(parsed.error, { status: 400 });
  }

  if (!user.persisted) {
    await createAnonymousUser({ userId: user.userId, anon: true });
    await setAuthTokenCookie({ ...user, persisted: true });
  }

  const { userId, model, content } = parsed.data;
  let { threadId } = parsed.data;

  if (threadId.startsWith('new:')) {
    threadId = threadId.replace('new:', '');
    await createThread({ threadId, userId, title: '', model });
  }

  const messages = parsed.data.threadId ? await getThreadMessages(threadId) : [];
  const [messageUser, messageAssistant] = await createPendingUserAssistantMessages(threadId, model, content);

  const outputStream = await stream(model, [...messages, messageUser]);

  const responseStream = new ReadableStream({
    async start(controller) {
      const outputReader = outputStream.textStream.getReader();

      controller.enqueue(encodeSSE({ type: 'pending', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'pending', v: messageAssistant }));

      while (true) {
        const { done, value } = await outputReader.read();
        if (done) break;

        messageAssistant.content += value;

        controller.enqueue(encodeSSE({ type: 'content', v: value }));
      }

      messageAssistant.structured = parseMoviesFromOutputStream(messageAssistant.content);

      await Promise.all(
        messageAssistant.structured.map(async (parsedOutput, index) => {
          const found = await findMovie(parsedOutput.title, parsedOutput.releaseYear);
          if (!found) return parsedOutput;

          const source = await getMovieById(found.id);
          if (!source) return parsedOutput;

          const movie = await createMovie(source);

          console.log(movie);
          controller.enqueue(encodeSSE({ type: 'movie', v: movie }));

          messageAssistant.structured![index].tmdbId = movie.tmdbId;
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
