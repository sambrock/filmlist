import { fetchMutation, fetchQuery } from 'convex/nextjs';
import { z } from 'zod';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { getModelCompletion } from '@/lib/openai/query';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(async (opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

  createThread: baseProcedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation(async (opts) => {
      return fetchMutation(api.threads.createThread, {
        title: opts.input.title,
      });
    }),

  chat: baseProcedure
    .input(
      z.object({
        threadId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async (opts) => {
      await fetchMutation(api.messages.createUserMessage, {
        threadId: opts.input.threadId as Id<'threads'>,
        content: opts.input.content,
      });

      const completion = await getModelCompletion(opts.input.content);

      await fetchMutation(api.messages.createAssistantMessage, {
        threadId: opts.input.threadId as Id<'threads'>,
        content: completion || 'No response from model',
      });

      return {};
    }),

  messages: baseProcedure
    .input(
      z.object({
        threadId: z.string(),
      })
    )
    .query(async (opts) => {
      return fetchQuery(api.messages.getThreadMessages, {
        threadId: opts.input.threadId as Id<'threads'>,
      });
    }),
});

export type AppRouter = typeof appRouter;
