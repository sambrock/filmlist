import { baseProcedure, createTRPCRouter } from './init';
import { chatProcedure } from './procedures/chat.procedure';
import { getChatMessagesProcedure } from './procedures/get-chat-messages.procedure';
import { getUserInfoProcedure } from './procedures/get-user-info.procedure';
import { initThreadProcedure } from './procedures/init-thread.procedure';

export type AppRouter = typeof appRouter;

export const appRouter = createTRPCRouter({
  ping: baseProcedure.query(() => ({ message: 'OK' })),

  chat: chatProcedure,
  getChatMessages: getChatMessagesProcedure,
  getUserInfo: getUserInfoProcedure,
  initThread: initThreadProcedure,
});
