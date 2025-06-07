import { baseProcedure, createTRPCRouter } from './init';
import { chatProcedure } from './procedures/chat.procedure';
import { getChatMessagesProcedure } from './procedures/get-chat-messages.procedure';
import { getUserInfoProcedure } from './procedures/get-user-info.procedure';

export type AppRouter = typeof appRouter;

export const appRouter = createTRPCRouter({
  chat: chatProcedure,
  getChatMessages: getChatMessagesProcedure,
  getUserInfo: getUserInfoProcedure,

  ping: baseProcedure.query(() => ({ message: 'OK' })),
});
