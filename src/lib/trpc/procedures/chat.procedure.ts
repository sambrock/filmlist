import { Readable } from 'stream';
import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { messages, threads } from '@/lib/drizzle/schema';
import { openai } from '@/lib/openai';
import { generateUuid } from '@/lib/utils/uuid';
import { baseProcedure } from '../init';

export type ChatInput = z.infer<typeof chatInput>;

export const chatInput = z.object({
  messageId: z.string(),
  threadId: z.string(),
  content: z.string(),
  model: z.string().default('meta-llama/llama-3.3-8b-instruct:free'),
  threadExists: z.boolean().default(true).optional(),
});

export const chatProcedure = baseProcedure.input(chatInput).subscription(async (opts) => {
  const { messageId, threadId, content, model, threadExists } = opts.input;

  if (!threadExists) {
    await db.insert(threads).values({
      threadId,
      ownerId: '37d387ec-32fd-45f7-af31-0df25936b241',
      title: '',
      model,
    });
  }

  await db.insert(messages).values({
    messageId,
    threadId,
    content,
    model,
    role: 'user',
  });

  const completionStream = openai.chat.completions.stream({
    model: opts.input.model,
    messages: [
      {
        role: 'user',
        content: `You are a movie recommendation AI. Suggest 5 movies that are "${opts.input.content}". For each movie title and release year. Format the output as a JSON array of objects with 'title' and 'release_year' keys. Only suggest existing movies.`,
      },
    ],
  });

  const readableStream = new Readable({
    encoding: 'utf-8',
    read() {},
  });

  completionStream.on('content', async (content) => {
    console.log('content', content);
    readableStream.push(content, 'utf-8');
  });

  completionStream.on('end', () => {
    console.log('Stream ended');
    readableStream.push(null);
  });

  completionStream.on('finalContent', async (content) => {
    await db.insert(messages).values({
      messageId: generateUuid(),
      threadId: opts.input.threadId,
      content,
      model: opts.input.model,
      role: 'assistant',
    });
  });

  return readableStream;
});
