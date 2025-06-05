import { db } from '@/lib/drizzle/db';
import { insertMessageSchema, messages } from '@/lib/drizzle/schema';
import { baseProcedure, createTRPCRouter } from '../init';

export const chatRouter = createTRPCRouter({
  chat: baseProcedure.input(insertMessageSchema).mutation(async (opts) => {
    await db.transaction(async (tx) => {
      await tx.insert(messages).values({
        messageId: opts.input.messageId,
        threadId: opts.input.threadId,
        content: opts.input.content,
        role: opts.input.role,
        model: opts.input.model,
      });

      
    });

    // try {
    //   await fetchMutation(api.messages.createUserMessage, {
    //     threadId: opts.input.threadId as Id<'threads'>,
    //     content: opts.input.content,
    //   });
    //   const completion = await getModelCompletion(opts.input.content);
    //   const parsed = parseCompletionToMovies(completion || '');
    //   console.log(parsed);
    //   await fetchMutation(api.messages.createAssistantMessage, {
    //     threadId: opts.input.threadId as Id<'threads'>,
    //     content: completion || 'No response from model',
    //   });
    //   return {};
    // } catch (err) {
    //   console.log(err);
    // }
  }),
});
