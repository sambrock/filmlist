import { Readable } from 'stream';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { ROLE_ASSISTANT, ROLE_USER } from '@/lib/constants';
import { db } from '@/lib/drizzle/db';
import { messages, threads } from '@/lib/drizzle/schema';
import { openaiClient } from '@/lib/openai/client';
import { supportedModelsEnum } from '@/lib/openai/models';
import { ChatMessage } from '@/lib/types';
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

  completionStream.on('content', async (content) => {
    assistantMessage.content += content;
    readableStream.push(JSON.stringify(assistantMessage), 'utf-8');
  });

  completionStream.on('finalContent', async (content) => {
    assistantMessage.content = content;
    readableStream.push(JSON.stringify(assistantMessage), 'utf-8');
    await db.insert(messages).values(assistantMessage);
  });

  completionStream.on('end', () => {
    readableStream.push(null); // End stream
  });

  return readableStream;
});
