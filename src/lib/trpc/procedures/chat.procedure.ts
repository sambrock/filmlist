import { Readable } from 'stream';
import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { messages } from '@/lib/drizzle/schema';
import { openai } from '@/lib/openai';
import { ChatMessage } from '@/lib/types';
import { generateUuid } from '@/lib/utils/uuid';
import { baseProcedure } from '../init';

export type ChatInput = z.infer<typeof chatInput>;

export const chatInput = z.object({
  messageId: z.string(),
  threadId: z.string(),
  content: z.string(),
  model: z.string().default('meta-llama/llama-3.3-8b-instruct:free'),
});

export const chatProcedure = baseProcedure.input(chatInput).subscription(async (opts) => {
  const { messageId, threadId, content, model } = opts.input;

  await db.insert(messages).values({
    messageId,
    threadId,
    content,
    model,
    role: 'user',
  });

  const completionStream = openai.chat.completions.stream({
    model,
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

  const assistantMessage: ChatMessage = {
    messageId: generateUuid(),
    threadId: opts.input.threadId,
    content: '',
    model: 'deepseek/deepseek-chat-v3-0324:free',
    role: 'assistant',
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
