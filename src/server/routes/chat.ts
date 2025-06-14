import { createRoute } from '@hono/zod-openapi';
import { streamSSE } from 'hono/streaming';
import { z } from 'zod';

import { AppRouteHandler } from '@/server/types';
import { ROLE_USER } from '@/lib/constants';
import { db } from '@/lib/drizzle/db';
import { messages } from '@/lib/drizzle/schema';
import { openaiClient } from '@/lib/openai/client';
import { supportedModelsEnum } from '@/lib/openai/models';
import { baseMessage } from '@/lib/utils/chat';
import { HttpStatusCodes, jsonContent } from '@/lib/utils/server';
import { generateUuid } from '@/lib/utils/uuid';

const chatSchema = z.object({
  messageId: z.string(),
  threadId: z.string(),
  content: z.string(),
  model: z.enum(supportedModelsEnum),
});

export const route = createRoute({
  path: '/chat',
  method: 'post',
  tags: ['Chat'],
  description: 'Returns streaming chat responses',
  request: {
    body: {
      content: jsonContent(chatSchema),
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: 'Chat response stream',
      content: {
        'text/event-stream': {
          schema: {
            type: 'string',
          },
        },
      },
    },
  },
});

export const handler: AppRouteHandler<typeof route> = async (c) => {
  const data = c.req.valid('json');

  await db.insert(messages).values({
    messageId: data.messageId,
    threadId: data.threadId,
    content: data.content,
    model: data.model,
    role: ROLE_USER,
  });

  const completion = openaiClient.chat.completions.stream({
    model: data.model,
    messages: [
      {
        role: ROLE_USER,
        content: baseMessage(data.content),
      },
    ],
  });

  return streamSSE(c, async (stream) => {
    completion.on('content', async (content) => {
      await stream.writeSSE({
        event: 'content',
        data: content,
      });
    });

    completion.on('finalContent', async (finalContent) => {
      const assistantMessage = await db
        .insert(messages)
        .values({
          messageId: generateUuid(),
          threadId: data.threadId,
          content: finalContent,
          model: data.model,
          role: ROLE_USER,
        })
        .returning()
        .then((res) => res[0]);

      await stream.writeSSE({
        event: 'finalContent',
        data: JSON.stringify(assistantMessage),
      });

      await stream.close();
    });

    while (true) {
      await stream.sleep(100000); // Keep stream alive
    }
  });
};
